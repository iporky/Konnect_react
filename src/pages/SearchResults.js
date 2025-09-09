import SendIcon from '@mui/icons-material/Send';
import { Avatar, Box, CircularProgress, Divider, IconButton, InputBase, Paper, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { chatCompletion } from '../services/openaiClient';

function useQueryParam(name) {
  const { search } = useLocation();
  return new URLSearchParams(search).get(name) || '';
}

export default function SearchResults() {
  const navigate = useNavigate();
  const q = useQueryParam('q');
  const mode = 'standard';
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // {id, role:'user'|'assistant', content, loading?, error?}
  const [activeRunId, setActiveRunId] = useState(null);
  // Removed unused global error state (handled per-message)
  // Password gating removed; all searches run immediately
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
      const result = await chatCompletion({ prompt, signal: controller.signal });
      if (currentRun !== runIdRef.current) return; // stale
      if (result.error) {
        setMessages(ms => ms.map(m => m.id === assistantMsgId ? { ...m, loading: false, error: result.error, content: '' } : m));
        return;
      }
      setMessages(ms => ms.map(m => m.id === assistantMsgId ? { ...m, loading: false, content: result.content } : m));
    } catch (e) {
      if (currentRun !== runIdRef.current) return;
      const msg = e?.message || 'Unknown error';
      setMessages(ms => ms.map(m => m.id === assistantMsgId ? { ...m, loading: false, error: msg } : m));
    } finally {
      if (currentRun === runIdRef.current) setActiveRunId(null);
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

  // Auto-scroll to bottom on new messages
  const scrollRef = useRef();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box sx={{ p: { xs: 1.5, md: 4 }, display: 'flex', flexDirection: 'column', height: '100%', background: (theme) => `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, #ffffff 140%)` }}>
      {/* Header */}
      <Box sx={{ mb: 3, maxWidth: 760, width: '100%', mx: 'auto', px: { xs: 0.5, sm: 1, md: 0 } }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            color: '#3289C9',
            fontFamily: 'Metropolis',
            fontWeight: 700,
            fontSize: { xs: '26px', md: '48px' },
            lineHeight: 1.1,
            letterSpacing: { xs: '-0.32px', md: '-0.56px' },
          }}
        >
          Search
        </Typography>
      </Box>

      {/* Chat Area */}
      <Box ref={scrollRef} sx={{ flex: 1, overflowY: 'auto', pb: 2, scrollbarWidth: 'thin', '&::-webkit-scrollbar': { width: 8 }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 4 } }}>
        <Box sx={{ maxWidth: 760, width: '100%', mx: 'auto', px: { xs: 0.5, sm: 1, md: 0 }, pt: 0.5 }}>
          {messages.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>Ask a question to get started.</Typography>
          )}
          {messages.map(m => (
            <Box key={m.id} sx={{ mb: 3, display: 'flex', flexDirection: 'column' }}>
              {m.role === 'user' && (
                <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                  <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: 'primary.main', mt: 0.5 }}>You</Avatar>
                  <Paper elevation={2} sx={{ maxWidth: '100%', px: 2.25, py: 1.25, borderRadius: 4, background: 'linear-gradient(135deg,#f3f7fc,#e6eef8)', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.content}</Typography>
                  </Paper>
                </Box>
              )}
              {m.role === 'assistant' && (
                <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', mt: 0.5 }}>
                  <Avatar sx={{ width: 34, height: 34, fontSize: 13, bgcolor: 'success.main', mt: 0.5 }}>AI</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Paper variant="outlined" sx={{ px: 2, py: 1.5, borderRadius: 4, backgroundColor: '#fff' }}>
                      {m.loading && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={18} />
                          <Typography variant="caption">Thinking...</Typography>
                        </Box>
                      )}
                      {m.error && (
                        <Typography variant="body2" color="error" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.error}</Typography>
                      )}
                      {!m.loading && !m.error && m.content && (
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, wordBreak: 'break-word' }}>{m.content}</Typography>
                      )}
                      {!m.loading && !m.error && !m.content && (
                        <Typography variant="caption" color="text.secondary">No answer.</Typography>
                      )}
                    </Paper>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
          {messages.length > 0 && <Divider sx={{ my: 1, opacity: 0.35 }} />}
        </Box>
      </Box>

      {/* Input at bottom */}
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
          maxWidth: 760,
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
          placeholder="Ask anything about Korea"
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
  );
}
