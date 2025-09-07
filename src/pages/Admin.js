import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material';
import SearchPasswordDialog from '../components/SearchPasswordDialog';
import { questionsAPI } from '../services/questionsAPI';

const Admin = () => {
  const searchAuthKey = 'searchAuthorized';
  const [authorized, setAuthorized] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [submitting, setSubmitting] = useState({});

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await questionsAPI.list({ skip: 0, limit: 200 });
      setList(Array.isArray(data) ? data.filter(q => !q.answer) : []);
    } catch (e) {
      setError(e?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem(searchAuthKey) === '1') {
      setAuthorized(true);
    } else {
      setPwdOpen(true);
    }
  }, []);

  useEffect(() => {
    if (authorized) load();
  }, [authorized]);

  const submitAnswer = async (q) => {
    const answer = (answerDrafts[q.id] || '').trim();
    if (!answer) return;
    setSubmitting(s => ({ ...s, [q.id]: true }));
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const answered_by = user.email || 'admin';
      await questionsAPI.answer(q.id, { question_text: q.question_text, answer, answered_by });
      setList(l => l.filter(item => item.id !== q.id));
    } catch (e) {
      setError(e?.message || 'Answer submit failed');
    } finally {
      setSubmitting(s => ({ ...s, [q.id]: false }));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%', p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Admin: Unanswered Questions</Typography>
      {error && <Typography color="error" sx={{ mb:2 }}>{error}</Typography>}
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap:1, mb:2 }}>
          <CircularProgress size={20} /> <Typography variant="body2">Loading...</Typography>
        </Box>
      )}
      <Container maxWidth="md" disableGutters>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {list.map(q => (
            <Paper key={q.id} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{q.question_text}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Asked by {q.asked_by || 'unknown'} • {new Date(q.asked_at).toLocaleString()}
              </Typography>
              <TextField
                placeholder="Type answer"
                value={answerDrafts[q.id] || ''}
                onChange={(e) => setAnswerDrafts(d => ({ ...d, [q.id]: e.target.value }))}
                multiline
                minRows={2}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={() => submitAnswer(q)} disabled={submitting[q.id] || !(answerDrafts[q.id] || '').trim()} variant="contained" size="small">
                  {submitting[q.id] ? 'Submitting...' : 'Submit Answer'}
                </Button>
              </Box>
            </Paper>
          ))}
          {!loading && list.length === 0 && (
            <Typography color="text.secondary">No unanswered questions.</Typography>
          )}
        </Box>
      </Container>
      <SearchPasswordDialog
        open={pwdOpen && !authorized}
        onClose={() => { setPwdOpen(false); if (!authorized) window.history.back(); }}
        onSuccess={() => { sessionStorage.setItem(searchAuthKey, '1'); setAuthorized(true); setPwdOpen(false); }}
      />
    </Box>
  );
};

export default Admin;