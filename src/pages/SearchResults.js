import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Divider, IconButton, InputBase, Paper, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import BookingSuccessNotification from '../components/BookingSuccessNotification';
import FeedbackPopup from '../components/FeedbackPopup';
import SourcesPanel from '../components/SourcesPanel';
import FollowupQuestionsTemplate from '../components/templates/FollowupQuestionsTemplate';
import StreamingSearchTemplate from '../components/templates/StreamingSearchTemplate';
import { createSearchAbortController, performStreamingSearch } from '../services/searchAPI';

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
  const [visibleRecs, setVisibleRecs] = useState(2); // This state controls how many recommendation items are shown (2 at a time)
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [bookedRecommendations, setBookedRecommendations] = useState(new Set());
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [lastBookingDetails, setLastBookingDetails] = useState(null);
  const abortRef = useRef();
  const runIdRef = useRef(0);

  // Effect to show sticky questions when a response is complete and has follow-up questions
  useEffect(() => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistantMessage || lastAssistantMessage.loading) return;
    
    let hasFollowupQuestions = false;
    
    // Check if the last assistant message has follow-up questions
    if (lastAssistantMessage.chunks && lastAssistantMessage.chunks.followup_questions) {
      hasFollowupQuestions = Array.isArray(lastAssistantMessage.chunks.followup_questions) && 
                            lastAssistantMessage.chunks.followup_questions.length > 0;
    } else if (lastAssistantMessage.content) {
      try {
        const parsed = JSON.parse(lastAssistantMessage.content);
        if (parsed.answer && parsed.answer.followup_questions) {
          hasFollowupQuestions = Array.isArray(parsed.answer.followup_questions) && 
                                parsed.answer.followup_questions.length > 0;
        }
      } catch {
        // Not JSON, no follow-up questions
      }
    }
    
    if (hasFollowupQuestions) {
      setShowStickyQuestions(true);
    }
  }, [messages]);

  const run = useCallback(async (prompt, assistantMsgId) => {
    if (!prompt.trim()) return;
    
    // Abort any existing request
    if (abortRef.current) abortRef.current.abort();
    const controller = createSearchAbortController();
    abortRef.current = controller;
    
    const currentRun = ++runIdRef.current;
    setActiveRunId(currentRun);
    
    // Handle streaming chunks
    const handleChunk = (chunkData) => {
      if (currentRun !== runIdRef.current) return; // stale request
      
      setMessages(ms => ms.map(m => m.id === assistantMsgId ? { 
        ...m, 
        loading: !chunkData.isComplete,
        chunks: chunkData.chunks,
        content: typeof chunkData.responseStructure === 'string' 
          ? chunkData.responseStructure 
          : JSON.stringify(chunkData.responseStructure)
      } : m));
    };
    
    // Handle completion
    const handleComplete = () => {
      console.log('Stream processing completed, cleaning up');
      if (currentRun === runIdRef.current) {
        setActiveRunId(null);
        // Ensure loading is false
        setMessages(ms => ms.map(m => m.id === assistantMsgId && m.loading ? { 
          ...m, 
          loading: false
        } : m));
      }
    };
    
    // Handle errors
    const handleError = (error) => {
      if (currentRun !== runIdRef.current) return;
      console.error('Streaming API error:', error);
      const msg = error?.message || 'Unknown error occurred';
      setMessages(ms => ms.map(m => m.id === assistantMsgId ? { 
        ...m, 
        loading: false, 
        error: msg 
      } : m));
      
      if (currentRun === runIdRef.current) {
        setActiveRunId(null);
      }
    };
    
    // Perform the streaming search using the API service
    await performStreamingSearch(
      prompt,
      controller.signal,
      handleChunk,
      handleComplete,
      handleError
    );
  }, []);

  // Seed only once from initial query param; retain history on subsequent URL updates
  useEffect(() => {
    if (messages.length > 0) return; // already initialized
    if (q) {
      // Fallback UUID generator for environments without crypto.randomUUID
      function generateUUID() {
        // RFC4122 version 4 compliant UUID (not cryptographically secure)
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : ((r & 0x3) | 0x8); // Add parentheses to clarify precedence
          return v.toString(16);
        });
      }

      const uid = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : generateUUID();
      const aid = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : generateUUID();
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
    setShowStickyQuestions(false); // Hide current sticky questions when asking new question
    setVisibleRecs(2); // Reset visible recommendations for new query
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
    setShowStickyQuestions(false); // Hide current sticky questions when asking follow-up
    setVisibleRecs(2); // Reset visible recommendations for new query
    
    // Auto-submit the follow-up question
    const uid = crypto.randomUUID();
    const aid = crypto.randomUUID();
    
    // Append new question and response at the end (natural order)
    setMessages(ms => [
      ...ms,
      { id: uid, role: 'user', content: question },
      { id: aid, role: 'assistant', content: '', loading: true }
    ]);
    
    // Scroll to bottom but with some offset to show the new question near the top
    setTimeout(() => {
      if (scrollRef.current) {
        // Scroll to bottom minus some offset to position the new question near the top
        const scrollContainer = scrollRef.current;
        const targetScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight + 100;
        scrollContainer.scrollTop = Math.max(0, targetScroll);
      }
    }, 100);
    
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

  const handleBookingOpen = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setBookingModalOpen(true);
  };

  const handleBookingClose = () => {
    setBookingModalOpen(false);
    setSelectedRecommendation(null);
  };

  const handleBookingSuccess = (bookingDetails) => {
    // Mark this recommendation as booked
    if (selectedRecommendation) {
      setBookedRecommendations(prev => new Set([...prev, selectedRecommendation.title || selectedRecommendation.name || Math.random()]));
    }
    
    // Show success notification
    setLastBookingDetails(bookingDetails);
    setShowSuccessNotification(true);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

  const scrollRef = useRef();

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
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                position: 'relative'
              }}>
                <Box sx={{ 
                  maxWidth: { md: '820px' }, 
                  width: '100%', 
                  mx: 'auto', 
                  textAlign: 'center',
                  pr: { xs: '140px', md: 0 } // Add right padding on mobile to avoid button overlap
                }}>
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
                
                {/* Login/Signup buttons on the right */}
                <Box
                  sx={{
                    position: 'absolute',
                    right: { xs: 8, md: 10 },
                    display: 'flex',
                    gap: { xs: 0.5, md: 1 },
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => navigate('/signup')}
                    sx={{
                      borderRadius: '25px',
                      px: { xs: 1.5, md: 2.5 },
                      height: { xs: '28px', md: '36px' },
                      textTransform: 'none',
                      fontWeight: 600,
                      fontFamily: 'Metropolis',
                      fontStyle: 'normal',
                      fontSize: { xs: '9px', md: '11px' },
                      backgroundColor: '#121212',
                      color: '#ffffff',
                      border: '1px solid #121212',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#121212',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Sign up for free
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderRadius: '25px',
                      px: { xs: 1.5, md: 2.5 },
                      height: { xs: '28px', md: '36px' },
                      textTransform: 'none',
                      fontWeight: 600,
                      fontFamily: 'Metropolis',
                      fontStyle: 'normal',
                      fontSize: { xs: '9px', md: '11px' },
                      border: '1px solid #888888',
                      color: '#888888',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    Log in
                  </Button>
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
        <Box sx={{ maxWidth: { md: '820px' }, width: '100%', mx: 'auto', pt: 2 }}>
          {/* Date Section - At top of chat area */}
          {messages.length > 0 && (
            <Box sx={{ mb: 2 }}>
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
          )}
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
                    <Paper elevation={1} sx={{ px: 1.5, py: 1, borderRadius: 5, backgroundColor: '#f0f0f0', maxWidth: '100%', height: '36px' }}>
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
                          marginLeft: -0.2
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
                            visibleRecs={visibleRecs}
                            setVisibleRecs={setVisibleRecs}
                            onBookingClick={handleBookingOpen}
                            bookedRecommendations={bookedRecommendations}
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
                            visibleRecs={visibleRecs}
                            setVisibleRecs={setVisibleRecs}
                            onBookingClick={handleBookingOpen}
                            bookedRecommendations={bookedRecommendations}
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
          const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant' && !m.loading);
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
                bottom: '40px', // Above the input area
                zIndex: 10,
                mb: 1,
                maxWidth: { md: '630px' },
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
                  ml: -3.5,
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
              <Box sx={{ flex: 1, ml: -1 }}>
                <FollowupQuestionsTemplate
                  content={followupQuestions}
                  onFollowUpClick={(question) => {
                    handleFollowUpClick(question);
                    // Don't immediately hide, let the effect handle it
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
            p: 0,
            px: 3,
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: '50px',
            width: { xs: '90%', md: '660px' },
            maxWidth: { xs: 600, md: 660 },
            minHeight: 70,
            mx: 'auto',
            boxShadow: '0 4px 18px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(4px)',
            background: 'rgba(255,255,255,0.9)'
          }}
        >
          {/* Left-side icons: + Add */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <Tooltip title="Add files & more" placement="top" arrow>
              <IconButton
                size="small"
                aria-label="add-files"
                sx={{ color: '#000', '&:hover': { backgroundColor: 'transparent' } }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

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
      
      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onClose={handleBookingClose}
        onBookingSuccess={handleBookingSuccess}
        recommendation={selectedRecommendation}
      />
      
      {/* Success Notification */}
      <BookingSuccessNotification
        open={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        bookingDetails={lastBookingDetails}
      />
      
      </Box>
    </div>
  );
}
