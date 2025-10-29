import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { questionsAPI } from '../services/api';
import { Box, Chip, Container, IconButton, Typography, useTheme } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const categoryChips = ['Konnect AI', 'Community', 'Expert', 'Post Wall'];

const Library = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tabParam = params.get('tab');
  const [activeChip, setActiveChip] = useState(tabParam?.toLowerCase() === 'expert' ? 'Expert' : 'Konnect AI');
  const [data, setData] = useState([]); // static library JSON
  const [expertQuestions, setExpertQuestions] = useState([]);
  const [expertLoading, setExpertLoading] = useState(false);
  const [expertError, setExpertError] = useState('');
  const chipsRef = useRef(null);

  useEffect(() => {
    import('../data/library.json').then((mod) => setData(mod.default || []));
  }, []);

  // Sync URL param with chip selection
  useEffect(() => {
    const current = new URLSearchParams(location.search).get('tab');
    const expected = activeChip === 'Expert' ? 'expert' : null;
    if ((expected && current !== expected) || (!expected && current)) {
      const p = new URLSearchParams();
      if (expected) p.set('tab', expected);
      navigate(`/library${p.toString() ? '?' + p.toString() : ''}`, { replace: true });
    }
  }, [activeChip, location.search, navigate]);

  // Fetch expert questions when Expert tab active
  useEffect(() => {
    if (activeChip === 'Expert') {
      setExpertLoading(true);
      setExpertError('');
      questionsAPI.list({ skip: 0, limit: 100 })
        .then(list => {
          setExpertQuestions(Array.isArray(list) ? list : []);
          setExpertLoading(false);
        })
        .catch(err => {
          setExpertError(err?.message || 'Failed to load expert questions');
          setExpertLoading(false);
        });
    }
  }, [activeChip]);

  const items = activeChip === 'Expert' ? [] : data.filter((d) => d.answeredBy === activeChip);

  const timeFor = (d) => (d.answeredTime && d.answeredTime.trim() !== '' ? d.answeredTime : d.time);

  return (
  <Box sx={{ color: theme.palette.text.primary, display: 'flex', flexDirection: 'column', alignItems: 'stretch', pb: { xs: 6, md: 10, lg: 14 } }}>
      <Container
        maxWidth="lg"
        sx={{
          ml: { xs: 0, md: 30 },
          py: 4,
          minHeight: { xs: 'calc(100vh - 64px)', md: '95vh' },
        }}
      >
        {/* Chips row - carousel on mobile with arrows */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Box
            ref={chipsRef}
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: { xs: 'auto', md: 'visible' },
              flexWrap: { xs: 'nowrap', md: 'wrap' },
              px: { xs: 1, md: 0 },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
      {categoryChips.map((c) => (
              <Chip
                key={c}
                label={c}
        onClick={() => setActiveChip(c)}
                variant="outlined"
                color={activeChip === c ? 'error' : 'default'}
                sx={{
                  flex: '0 0 auto',
                  px: 1.5,
                  borderRadius: 999,
                  borderColor: activeChip === c ? '#DB6067' : 'divider',
                  color: activeChip === c ? '#DB6067' : 'text.primary',
                }}
              />
            ))}
          </Box>
          {/* Arrow hints on mobile */}
          <IconButton
            aria-label="scroll left"
            size="small"
            onClick={() => chipsRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              left: -6,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              boxShadow: 1,
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="scroll right"
            size="small"
            onClick={() => chipsRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              right: -6,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              boxShadow: 1,
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* List - mobile and desktop */}
        {activeChip === 'Expert' ? (
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {expertLoading && <Typography sx={{ mb:2 }}>Loading questions...</Typography>}
            {expertError && <Typography color="error" sx={{ mb:2 }}>{expertError}</Typography>}
            {!expertLoading && !expertError && expertQuestions.map(q => (
              <Box key={q.id} sx={{ pb: 2, mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontWeight: 600, mb: 1.2 }}>{q.question_text}</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 12, mb: 1.2 }}>
                  Asked by {q.asked_by || 'unknown'} • {new Date(q.asked_at).toLocaleString()}
                </Typography>
                {q.answer && (
                  <Typography sx={{ color: 'success.main', fontSize: 12, mb: 1.2, fontWeight: 500, fontStyle: 'italic', fontFamily: 'Metropolis' }}>{q.answer}</Typography>
                )}
              </Box>
            ))}
            {!expertLoading && !expertError && expertQuestions.length === 0 && (
              <Typography color="text.secondary">No questions yet.</Typography>
            )}
          </Box>
        ) : (
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {items.map((d) => (
            <Box key={d.id} sx={{ pb: 2, mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontWeight: 600, mb: 1.2 }}>{d.question}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 12, mb: 1.2 }}>{d.answer}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: 12 }}>
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">{timeFor(d)}</Typography>
                </Box>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
        )}

        {activeChip === 'Expert' ? (
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {expertLoading && <Typography sx={{ mb:2 }}>Loading questions...</Typography>}
          {expertError && <Typography color="error" sx={{ mb:2 }}>{expertError}</Typography>}
          {!expertLoading && !expertError && expertQuestions.map(q => (
            <Box key={q.id} sx={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography sx={{ fontWeight: 600, mb: 0.8 }}>{q.question_text}</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, mb: 0.8 }}>
                  Asked by {q.asked_by || 'unknown'} • {new Date(q.asked_at).toLocaleString()}
                </Typography>
                {q.answer && (
                  <Typography sx={{ color: 'success.main', fontSize: 14, mb: 0.8, fontWeight: 500, fontStyle: 'italic', fontFamily: 'Metropolis' }}>{q.answer}</Typography>
                )}
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          {!expertLoading && !expertError && expertQuestions.length === 0 && (
            <Typography color="text.secondary">No questions yet.</Typography>
          )}
        </Box>
        ) : (
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {items.map((d) => (
            <Box key={d.id} sx={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography sx={{ fontWeight: 600, mb: 1.2 }}>{d.question}</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, mb: 1.2 }}>{d.answer}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{timeFor(d)}</Typography>
                  <Typography variant="body2" sx={{ '&::before': { content: '"•"', mx: 1 } }}>
                    {d.answeredBy}
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
        )}
      </Container>
    </Box>
  );
};

export default Library;
