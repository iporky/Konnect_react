import React, { useEffect, useRef, useState } from 'react';
import { Box, Chip, Container, IconButton, Typography, useTheme } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const categoryChips = ['Konnect AI', 'Community', 'Expert', 'Post Wall'];

const Library = () => {
  const theme = useTheme();
  const [activeChip, setActiveChip] = useState('Konnect AI');
  const [data, setData] = useState([]);
  const chipsRef = useRef(null);

  useEffect(() => {
    import('../data/library.json').then((mod) => setData(mod.default || []));
  }, []);

  const items = data.filter((d) => d.answeredBy === activeChip);

  const timeFor = (d) => (d.answeredTime && d.answeredTime.trim() !== '' ? d.answeredTime : d.time);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        ml: { xs: 0, md: 9 },
        mr: { xs: 0, md: 1 },
        mt: { xs: '64px', md: 1 },
        mb: { xs: '56px', md: 0, lg: 1 },
        minHeight: '60vh',
        borderRadius: { xs: 0, md: '14px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        pb: { xs: 6, md: 10, lg: 14 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          ml: { xs: 0, md: 30 },
          py: 4,
          minHeight: { xs: 'calc(100vh - 64px)', md: '95vh' },
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
          <Typography
            variant="h2"
            sx={{
              color: '#3289C9',
              fontFamily: 'Metropolis',
              fontWeight: 700,
              fontSize: { xs: '32px', md: '56px' },
              lineHeight: 1.1,
              letterSpacing: { xs: '-0.32px', md: '-0.56px' },
            }}
          >
            Library
          </Typography>
        </Box>

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
      </Container>
    </Box>
  );
};

export default Library;
