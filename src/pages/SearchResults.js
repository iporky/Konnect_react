import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { Box, Divider, IconButton, InputBase, Paper, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FeedbackPopup from '../components/FeedbackPopup';
import SourcesPanel from '../components/SourcesPanel';
import FollowupQuestionsTemplate from '../components/templates/FollowupQuestionsTemplate';
import StreamingSearchTemplate from '../components/templates/StreamingSearchTemplate';

function useQueryParam(name) {
  const { search } = useLocation();
  return new URLSearchParams(search).get(name) || '';
}

export default function SearchResults() {
  const navigate = useNavigate();
  const q = useQueryParam('q');
  const mode = 'standard';
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // {id, role:'user'|'assistant', content, loading?, error?, chunks?}
  const [activeRunId, setActiveRunId] = useState(null);
  const [isSourcesPanelOpen, setIsSourcesPanelOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [showStickyQuestions, setShowStickyQuestions] = useState(true);
  const abortRef = useRef();
  const runIdRef = useRef(0);

  const run = useCallback(async (prompt, assistantMsgId) => {
    if (!prompt.trim()) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const currentRun = ++runIdRef.current;
    setActiveRunId(currentRun);
    
    try {
      // Call the streaming API
      const response = await fetch('https://ec2-43-202-144-82.ap-northeast-2.compute.amazonaws.com/api/v1/konnect/search', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuestion: prompt
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is streaming
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let chunks = new Map(); // Store chunks by chunk_id
      let isComplete = false;
      
      // Structure to build the response
      let responseStructure = {
        searchQuestion: prompt,
        answer: {
          general_answer: '',
          recommendations: [],
          followup_questions: [],
          sources: []
        }
      };
      
      // Store chunks for progressive rendering
      let currentChunks = {};

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        if (currentRun !== runIdRef.current) return; // stale request
        
        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Since API sends complete JSON objects, try to parse each complete object
        // Split on newlines or look for complete JSON objects
        const jsonStrings = [];
        let startIndex = 0;
        
        // Look for complete JSON objects in the buffer
        while (startIndex < buffer.length) {
          let braceCount = 0;
          let inString = false;
          let escapeNext = false;
          let jsonStart = -1;
          
          for (let i = startIndex; i < buffer.length; i++) {
            const char = buffer[i];
            
            if (escapeNext) {
              escapeNext = false;
              continue;
            }
            
            if (char === '\\') {
              escapeNext = true;
              continue;
            }
            
            if (char === '"') {
              inString = !inString;
              continue;
            }
            
            if (!inString) {
              if (char === '{') {
                if (braceCount === 0) {
                  jsonStart = i;
                }
                braceCount++;
              } else if (char === '}') {
                braceCount--;
                if (braceCount === 0 && jsonStart !== -1) {
                  // Found complete JSON object
                  const jsonStr = buffer.substring(jsonStart, i + 1);
                  jsonStrings.push(jsonStr);
                  startIndex = i + 1;
                  break;
                }
              }
            }
          }
          
          // If we didn't find a complete JSON object, break and wait for more data
          if (braceCount > 0 || jsonStart === -1) {
            // Keep the remaining incomplete data in buffer
            buffer = buffer.substring(startIndex);
            break;
          }
        }
        
        console.log('Found complete JSON objects:', jsonStrings.length);
        
        for (const jsonStr of jsonStrings) {
          const trimmedJson = jsonStr.trim();
          if (!trimmedJson) continue;
          
          try {
            let jsonData;
            
            // Check if it's Server-Sent Events format
            if (trimmedJson.startsWith('data: ')) {
              const jsonStr = trimmedJson.substring(6);
              if (jsonStr === '[DONE]') break;
              jsonData = JSON.parse(jsonStr);
            } else {
              // Direct JSON streaming
              jsonData = JSON.parse(trimmedJson);
            }
            
            // Handle chunked streaming response format
            if (jsonData.request_id && jsonData.chunk_id !== undefined) {
              // Store this chunk
              chunks.set(jsonData.chunk_id, jsonData);
              
              // Process the chunk based on ui_element type
              const { ui_element, content } = jsonData;
              
              console.log('Processing chunk:', { chunk_id: jsonData.chunk_id, ui_element, content });
              
              // Store chunk for progressive rendering
              if (ui_element === 'general_answer') {
                currentChunks.general_answer = content;
                responseStructure.answer.general_answer = content;
              } else if (ui_element && ui_element.startsWith('recommendation_')) {
                currentChunks[ui_element] = content;
                const index = parseInt(ui_element.split('_')[1]);
                responseStructure.answer.recommendations[index] = content;
              } else if (ui_element === 'followup_questions') {
                currentChunks.followup_questions = Array.isArray(content) ? content : [content];
                responseStructure.answer.followup_questions = Array.isArray(content) ? content : [content];
              } else if (ui_element === 'sources') {
                currentChunks.sources = Array.isArray(content) ? content : [content];
                responseStructure.answer.sources = Array.isArray(content) ? content : [content];
              } else if (ui_element === 'is_last' && content === 'true') {
                isComplete = true;
              }
              
              console.log('Current chunks:', currentChunks);
              console.log('Is complete:', isComplete);
              
              // Update UI immediately with current chunks for progressive rendering
              const currentIsComplete = isComplete;
              setMessages(ms => ms.map(m => m.id === assistantMsgId ? { 
                ...m, 
                loading: !currentIsComplete,
                chunks: { ...currentChunks },
                content: JSON.stringify(responseStructure)
              } : m));
              
              // If we received the final chunk, we're done
              if (isComplete) {
                break;
              }
            } else {
              // Handle other response formats (fallback)
              setMessages(ms => ms.map(m => m.id === assistantMsgId ? { 
                ...m, 
                loading: false, 
                content: typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData)
              } : m));
              break;
            }
            
          } catch (parseError) {
            console.warn('Failed to parse JSON chunk:', trimmedJson, parseError);
          }
        }
        
        // If we're complete, break out of the main loop
        if (isComplete) {
          break;
        }
        
        // Optional: Add a small delay to prevent UI blocking
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Handle any remaining buffer content
      if (buffer.trim()) {
        try {
          const finalData = JSON.parse(buffer.trim());
          if (finalData.request_id && finalData.chunk_id !== undefined) {
            // Handle final chunk
            chunks.set(finalData.chunk_id, finalData);
            
            const { ui_element, content } = finalData;
            
            if (ui_element === 'general_answer') {
              currentChunks.general_answer = content;
              responseStructure.answer.general_answer = content;
            } else if (ui_element && ui_element.startsWith('recommendation_')) {
              currentChunks[ui_element] = content;
              const index = parseInt(ui_element.split('_')[1]);
              responseStructure.answer.recommendations[index] = content;
            } else if (ui_element === 'followup_questions') {
              currentChunks.followup_questions = Array.isArray(content) ? content : [content];
              responseStructure.answer.followup_questions = Array.isArray(content) ? content : [content];
            } else if (ui_element === 'sources') {
              currentChunks.sources = Array.isArray(content) ? content : [content];
              responseStructure.answer.sources = Array.isArray(content) ? content : [content];
            } else if (ui_element === 'is_last' && content === 'true') {
              isComplete = true;
            }
            
            setMessages(ms => ms.map(m => m.id === assistantMsgId ? { 
              ...m, 
              loading: false, 
              chunks: { ...currentChunks },
              content: JSON.stringify(responseStructure)
            } : m));
          } else {
            // Handle as regular response
            setMessages(ms => ms.map(m => m.id === assistantMsgId ? { 
              ...m, 
              loading: false, 
              content: typeof finalData === 'string' ? finalData : JSON.stringify(finalData)
            } : m));
          }
        } catch (parseError) {
          console.warn('Failed to parse final buffer:', buffer, parseError);
        }
      }
      
      if (currentRun !== runIdRef.current) return; // stale
      
      // If we haven't set a final response yet, finalize with what we have
      if (!isComplete) {
        console.log('Stream ended without is_last marker, finalizing response');
        setMessages(ms => ms.map(m => m.id === assistantMsgId ? { 
          ...m, 
          loading: false, 
          content: JSON.stringify(responseStructure)
        } : m));
      }
      
    } catch (e) {
      if (currentRun !== runIdRef.current) return;
      console.error('Streaming API error:', e);
      const msg = e?.message || 'Unknown error occurred';
      setMessages(ms => ms.map(m => m.id === assistantMsgId ? { 
        ...m, 
        loading: false, 
        error: msg 
      } : m));
    } finally {
      console.log('Stream processing completed, cleaning up');
      if (currentRun === runIdRef.current) {
        setActiveRunId(null);
        // Ensure loading is false
        setMessages(ms => ms.map(m => m.id === assistantMsgId && m.loading ? { 
          ...m, 
          loading: false
        } : m));
      }
    }
  }, []);

  // Seed only once from initial query param; retain history on subsequent URL updates
  useEffect(() => {
    if (messages.length > 0) return; // already initialized
    if (q) {
      const uid = crypto.randomUUID();
      const aid = crypto.randomUUID();
      setMessages([
        { id: uid, role: 'user', content: q },
        { id: aid, role: 'assistant', content: '', loading: true }
      ]);
      run(q, aid);
    }
  }, [q, run, messages.length]);

  // Fetch questions list when in expert mode (initial + after post)
  // (Expert mode removed from SearchResults)

  // If URL has mode=expert but user turned off expertMode, strip param
  useEffect(() => {
    if (mode === 'expert') {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      navigate(`/search?${params.toString()}`, { replace: true });
    }
  }, [mode, q, navigate]);

  const submit = (e) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt) return;
    setInput('');
    setShowStickyQuestions(true); // Reset sticky questions for new query
    // Append new user + assistant placeholder
    const uid = crypto.randomUUID();
    const aid = crypto.randomUUID();
    setMessages(ms => [
      ...ms,
      { id: uid, role: 'user', content: prompt },
      { id: aid, role: 'assistant', content: '', loading: true }
    ]);
    // Optionally update URL with last asked question
    const params = new URLSearchParams();
    params.set('q', prompt);
    navigate(`/search?${params.toString()}`, { replace: true });
    run(prompt, aid);
  };

  const handleFollowUpClick = (question) => {
    setInput(question);
    setShowStickyQuestions(true); // Reset sticky questions for new query
    // Auto-submit the follow-up question
    const uid = crypto.randomUUID();
    const aid = crypto.randomUUID();
    setMessages(ms => [
      ...ms,
      { id: uid, role: 'user', content: question },
      { id: aid, role: 'assistant', content: '', loading: true }
    ]);
    const params = new URLSearchParams();
    params.set('q', question);
    navigate(`/search?${params.toString()}`, { replace: true });
    run(question, aid);
  };

  const handleRegenerateAnswer = (query) => {
    if (!query) return;
    
    // Find the most recent assistant message and regenerate it
    const lastAssistantIndex = messages.findLastIndex(m => m.role === 'assistant');
    if (lastAssistantIndex === -1) return;
    
    const assistantMsgId = messages[lastAssistantIndex].id;
    
    // Reset the assistant message to loading state
    setMessages(ms => ms.map(m => 
      m.id === assistantMsgId 
        ? { ...m, loading: true, content: '', error: null }
        : m
    ));
    
    // Re-run the query
    run(query, assistantMsgId);
  };

  const handleSourcesPanelToggle = (isOpen) => {
    setIsSourcesPanelOpen(isOpen);
  };

  // Auto-scroll to bottom on new messages
  const scrollRef = useRef();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', height: '97vh', position: 'relative', gap: 1, overflow: 'hidden' }}>
        {/* Main Content Area */}
        <Box 
          sx={{ 
            width: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            backgroundColor: '#fff',
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          {/* Header Section - Title and Date */}
          {messages.length > 0 && (
            <>
              {/* Header with Title */}
              <Box sx={{ 
                px: { xs: 1.5, sm: 2, md: 4 }, 
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid rgba(0,0,0,0.08)'
              }}>
                <Box sx={{ maxWidth: { md: '820px' }, width: '100%', mx: 'auto', textAlign: 'center' }}>
                  {/* Title - First 10 words of current question */}
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1a1a1a', 
                      fontSize: { xs: '14px', md: '16px' },
                      lineHeight: 1.2
                    }}
                  >
                    {(() => {
                      // Get the most recent user question
                      const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
                      if (lastUserMessage?.content) {
                        const words = lastUserMessage.content.trim().split(' ');
                        return words.slice(0, 10).join(' ') + (words.length > 10 ? '' : '');
                      }
                      return 'Search Results';
                    })()}
                  </Typography>
                </Box>
              </Box>
              
              {/* Date Section - Below the border */}
              <Box sx={{ 
                px: { xs: 1.5, sm: 2, md: 4 }, 
                py: 2
              }}>
                <Box sx={{ maxWidth: { md: '820px' }, width: '100%', mx: 'auto' }}>
                  {/* Date with line */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2
                  }}>
                    <Box sx={{ 
                      flex: 1, 
                      height: '1px', 
                      backgroundColor: 'rgba(0,0,0,0.12)' 
                    }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary', 
                        fontWeight: 400,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      📅 {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                    <Box sx={{ 
                      flex: 1, 
                      height: '1px', 
                      backgroundColor: 'rgba(0,0,0,0.12)' 
                    }} />
                  </Box>
                </Box>
              </Box>
            </>
          )}
      {/* Chat Area */}
      <Box 
        ref={scrollRef} 
        sx={{ 
          flex: 1, 
            /* independent scroll area beneath sticky header */
          overflowY: 'auto', 
          px: { xs: 1.5, sm: 2, md: 4 },
          pb: 2, 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin', 
          '&::-webkit-scrollbar': { width: 8 }, 
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 4 } 
        }}
      >
        <Box sx={{ maxWidth: { md: '820px' }, width: '100%', mx: 'auto', pt: 0.5 }}>
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>Ask a question to get started.</Typography>
          )}
          {messages.map(m => (
            <Box key={m.id} sx={{ mb: 3, display: 'flex', flexDirection: 'column' }}>
              {m.role === 'user' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'flex-end' }}>
                      {new Date().toLocaleTimeString('en-US', { 
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false 
                      })}
                    </Typography>
                    <Paper elevation={1} sx={{ px: 2.5, py: 1.5, borderRadius: 5, backgroundColor: '#f0f0f0', maxWidth: '100%' }}>
                      <Typography variant="body2" sx={{ 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-word', 
                        color: '#333',
                        maxWidth: '50ch', // Approximately 100 characters
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {m.content}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              )}
              {m.role === 'assistant' && (
                <Box sx={{ mt: 0.5 }}>
                  {/* Header with logo above */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        component="img"
                        src={`${process.env.PUBLIC_URL}/images/Konnect_k_logo.png`}
                        alt="Konnect"
                        sx={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          objectFit: 'contain',
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.06)',
                          marginLeft: -5
                        }}
                      />
                      <Typography sx={{ fontWeight: 600, color: '#656565', letterSpacing: 0, fontSize: '14px' }}>
                        Konnect AI
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ pl: { xs: 0, sm: 0 }, minWidth: 0 }}>
                    {m.loading && !m.chunks && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5 }}>
                        <Typography variant="caption">Thinking...</Typography>
                      </Box>
                    )}
                    {m.error && (
                      <Typography variant="body2" color="error" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', py: 1.5 }}>{m.error}</Typography>
                    )}
                    {(m.content || m.chunks) && (
                      <>
                        {/* Use streaming template if chunks are available */}
                        {m.chunks ? (
                          <StreamingSearchTemplate 
                            chunks={m.chunks}
                            isLoading={m.loading}
                            onFollowUpClick={handleFollowUpClick}
                            onRegenerateAnswer={handleRegenerateAnswer}
                            currentQuery={messages.find(msg => msg.role === 'user' && msg.id === messages[messages.findIndex(msg => msg.id === m.id) - 1]?.id)?.content}
                            onSourcesPanelToggle={handleSourcesPanelToggle}
                            onReportClick={() => setFeedbackOpen(true)}
                          />
                        ) : (
                          /* Use StreamingSearchTemplate for all responses */
                          <StreamingSearchTemplate
                            chunks={(() => {
                              try {
                                const parsed = JSON.parse(m.content);
                                // Convert structured response to chunks format
                                const chunks = {};
                                if (parsed.answer) {
                                  if (parsed.answer.general_answer) chunks.general_answer = parsed.answer.general_answer;
                                  if (parsed.answer.recommendations) {
                                    parsed.answer.recommendations.forEach((rec, idx) => {
                                      chunks[`recommendation_${idx + 1}`] = rec;
                                    });
                                  }
                                  if (parsed.answer.followup_questions) chunks.followup_questions = parsed.answer.followup_questions;
                                }
                                return chunks;
                              } catch {
                                // For plain text responses, put in general_answer
                                return { general_answer: m.content };
                              }
                            })()} 
                            onFollowUpClick={handleFollowUpClick}
                            onRegenerateAnswer={handleRegenerateAnswer}
                            currentQuery={messages.find(msg => msg.role === 'user' && msg.id === messages[messages.findIndex(msg => msg.id === m.id) - 1]?.id)?.content}
                            onSourcesPanelToggle={handleSourcesPanelToggle}
                            onReportClick={() => setFeedbackOpen(true)}
                          />
                        )}
                      </>
                    )}
                    {!m.loading && !m.error && !m.content && (
                      <Typography variant="caption" color="text.secondary" sx={{ py: 1.5 }}>No answer.</Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
          {messages.length > 0 && <Divider sx={{ my: 1, opacity: 0.35 }} />}
        </Box>
      </Box>

      {/* Input at bottom */}
      <Box sx={{ px: { xs: 1.5, sm: 2, md: 4 }, pb: { xs: 1.5, md: 4 }, flexShrink: 0 }}>
        {/* Sticky Follow-up Questions */}
        {showStickyQuestions && messages.length > 0 && (() => {
          // Get the last assistant message with follow-up questions
          const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
          if (!lastAssistantMessage) return null;
          
          let followupQuestions = null;
          
          // Check if it's a streaming response with chunks
          if (lastAssistantMessage.chunks && lastAssistantMessage.chunks.followup_questions) {
            followupQuestions = lastAssistantMessage.chunks.followup_questions;
          } else if (lastAssistantMessage.content) {
            // Check if it's a structured JSON response
            try {
              const parsed = JSON.parse(lastAssistantMessage.content);
              if (parsed.answer && parsed.answer.followup_questions) {
                followupQuestions = parsed.answer.followup_questions;
              }
            } catch {
              // Not JSON, no follow-up questions
            }
          }
          
          if (!followupQuestions || !Array.isArray(followupQuestions) || followupQuestions.length === 0) {
            return null;
          }
          
          return (
            <Box
              sx={{
                position: 'sticky',
                bottom: '80px', // Above the input area
                zIndex: 10,
                mb: 2,
                maxWidth: { md: '768px' },
                width: '100%',
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {/* Close button on the left */}
              <IconButton 
                size="small" 
                onClick={() => setShowStickyQuestions(false)}
                sx={{ 
                  width: 32, 
                  height: 32,
                  color: '#666',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,1)',
                    borderColor: '#ccc'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              
              {/* Follow-up questions without background */}
              <Box sx={{ flex: 1 }}>
                <FollowupQuestionsTemplate
                  content={followupQuestions}
                  onFollowUpClick={(question) => {
                    handleFollowUpClick(question);
                    setShowStickyQuestions(false);
                  }}
                />
              </Box>
            </Box>
          );
        })()}
        <Paper
          component="form"
          onSubmit={submit}
          elevation={6}
          sx={{
            p: 1.25,
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: 999,
            maxWidth: { md: '820px' },
            width: '100%',
            mx: 'auto',
            boxShadow: '0 4px 18px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(4px)',
            background: 'rgba(255,255,255,0.9)'
          }}
        >
          <InputBase
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a Follow up"
            sx={{ flex: 1, fontSize: 14, ml: 0.5 }}
            disabled={!!activeRunId}
          />
          <Tooltip title={activeRunId ? 'Waiting for answer' : 'Send'}>
            <span>
              <IconButton type="submit" color="primary" disabled={!!activeRunId || !input.trim()}>
                <SendIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Paper>
      </Box>
      </Box>
      
      {/* Sources Panel - render as drawer */}
      <SourcesPanel
        open={isSourcesPanelOpen}
        onClose={() => setIsSourcesPanelOpen(false)}
        sources={(() => {
          const allSources = [];
          const seenSources = new Set(); // Track unique sources by name+link combination
          
          messages
            .filter(m => m.role === 'assistant' && m.content)
            .forEach(m => {
              try {
                const parsed = JSON.parse(m.content);
                if (parsed.answer?.recommendations) {
                  parsed.answer.recommendations.forEach(rec => {
                    if (rec.sources && Array.isArray(rec.sources)) {
                      // Handle new array format
                      rec.sources.forEach(source => {
                        if (source && source.name && source.link) {
                          const uniqueKey = `${source.name}|${source.link}`;
                          if (!seenSources.has(uniqueKey)) {
                            seenSources.add(uniqueKey);
                            allSources.push(source);
                          }
                        }
                      });
                    } else if (rec.sources && rec.sources.name && rec.sources.link) {
                      // Handle old single object format for backward compatibility
                      const uniqueKey = `${rec.sources.name}|${rec.sources.link}`;
                      if (!seenSources.has(uniqueKey)) {
                        seenSources.add(uniqueKey);
                        allSources.push(rec.sources);
                      }
                    }
                  });
                }
              } catch (e) {
                // Ignore parsing errors
              }
            });
          return allSources;
        })()} 
      />
      
      {/* Feedback Popup */}
      <FeedbackPopup 
        open={feedbackOpen} 
        onClose={() => setFeedbackOpen(false)} 
      />
      </Box>
    </div>
  );
}
