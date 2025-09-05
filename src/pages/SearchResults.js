import { useEffect, useRef, useState } from 'react';
import SearchPasswordDialog from '../components/SearchPasswordDialog';
import { Box, CircularProgress, IconButton, InputBase, Paper, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useLocation, useNavigate } from 'react-router-dom';
import { chatCompletion } from '../services/openaiClient';

function useQueryParam(name) {
  const { search } = useLocation();
  return new URLSearchParams(search).get(name) || '';
}

export default function SearchResults() {
  const navigate = useNavigate();
  const q = useQueryParam('q');
  const [input, setInput] = useState(q);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pwdOpen, setPwdOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const searchAuthKey = 'searchAuthorized';
  const abortRef = useRef();
  const runIdRef = useRef(0);

  const run = async (prompt) => {
    if (!prompt.trim()) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(''); // clear any previous error
    setAnswer('');
    const currentRun = ++runIdRef.current;
    const { content, error: err } = await chatCompletion({ prompt, signal: controller.signal });
    // Ignore if a newer run started
    if (currentRun !== runIdRef.current) return;
    const abortLike = err && err.toLowerCase().includes('abort');
    if (abortLike) {
      // Silent ignore: keep loading if a new run was triggered elsewhere, else stop loading gracefully
      if (abortRef.current === controller) {
        setLoading(false); // no newer run; just end without error
      }
      return;
    }
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }
    setAnswer(content);
    setLoading(false);
  };

  useEffect(() => {
    if (q) {
      if (sessionStorage.getItem(searchAuthKey) === '1') {
        setAuthorized(true);
        run(q);
      } else {
        setPwdOpen(true);
      }
    }
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(input)}`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <IconButton size="small" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Search</Typography>
      </Box>

      <Paper component="form" onSubmit={submit} sx={{ display: 'flex', alignItems: 'center', p: 1, mb: 3, borderRadius: 4 }}>
        <InputBase
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Korea"
          sx={{ flex: 1, fontSize: 14, ml: 1 }}
        />
      </Paper>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {authorized && loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Thinking...</Typography>
          </Box>
        )}
        {authorized && error && (
          <Typography color="error" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{error}</Typography>
        )}
        {authorized && !loading && !error && answer && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{answer}</Typography>
        )}
        {authorized && !loading && !error && !answer && q && (
          <Typography variant="body2" color="text.secondary">No answer yet.</Typography>
        )}
      </Box>
      <SearchPasswordDialog
        open={pwdOpen}
        onClose={() => { setPwdOpen(false); if (!authorized) navigate(-1); }}
  onSuccess={() => { sessionStorage.setItem(searchAuthKey, '1'); setAuthorized(true); setPwdOpen(false); setError(''); run(q); }}
      />
    </Box>
  );
}
