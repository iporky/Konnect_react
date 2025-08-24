import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, IconButton } from '@mui/material';
import { TrendingUp, ChevronLeft, ChevronRight } from '@mui/icons-material';

const TrendingSearches = () => {
  // Mock trending searches data
  const trendingSearches = [
    { id: 1, text: 'Currently trending topic', rank: 1, change: 'up' },
    { id: 2, text: 'Currently trending topic', rank: 2, change: 'up' },
    { id: 3, text: 'Currently trending topic', rank: 3, change: 'up' },
    { id: 4, text: 'Currently trending topic', rank: 4, change: 'up' },
    { id: 5, text: 'Currently trending topic', rank: 5, change: 'up' },
    { id: 6, text: 'Currently trending topic', rank: 6, change: 'up' },
    { id: 7, text: 'Currently trending topic', rank: 7, change: 'up' },
    { id: 8, text: 'Currently trending topic', rank: 8, change: 'up' },
  ];

  // Two-page carousel: first 5 then next 5
  const pages = [
    trendingSearches.slice(0, 5),
    trendingSearches.slice(5, 10),
  ];
  const [page, setPage] = useState(0);
  const nextPage = () => setPage((p) => (p === 1 ? 0 : p + 1));
  const prevPage = () => setPage((p) => (p === 0 ? 1 : p - 1));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1,
        borderRadius: '25px',
        backgroundColor: '#fff',
        height: 244,
        width: 260,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 0px 4px 0px #00000040',
      }}
    >
  {/* Header */}
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', mb: 2 }}>
        <TrendingUp sx={{ color: '#ff4757', mr: 1, fontSize: 18, ml: '-18px' }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            color: '#ff4757',
            fontSize: '15px',
            paddingLeft: '-18px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Trending searches
        </Typography>
      </Box>

      {/* Trending List (page content) */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1.5, 
        flex: 1,
        overflow: 'hidden',
        pr: 1,
      }}>
        {pages[page].map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.8,
              borderBottom: '1px solid',
              borderBottomColor: 'divider',
              '&:last-child': {
                borderBottom: 'none',
              },
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1,
                px: 0.5,
                mx: -0.5,
              },
            }}
          >
            {/* Rank and Text */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  color: 'text.secondary',
                  mr: 1,
                  minWidth: '14px',
                  fontSize: '12px',
                }}
              >
                {item.rank}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.primary',
                  fontSize: '12px',
                  lineHeight: 1.3,
                  flex: 1,
                }}
              >
                {item.text}
              </Typography>
            </Box>

            {/* Trending Indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                size="small"
                label="↗"
                sx={{
                  backgroundColor: '#ff4757',
                  color: 'white',
                  fontSize: '9px',
                  height: '16px',
                  minWidth: '16px',
                  '& .MuiChip-label': {
                    px: 0.3,
                  },
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Carousel controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
        {/* Dots */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {[0,1].map((i) => (
            <Box
              key={i}
              onClick={() => setPage(i)}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: i === page ? '#ff4757' : 'divider',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default TrendingSearches;
