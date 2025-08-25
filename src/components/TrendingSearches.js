import { Bolt } from '@mui/icons-material';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { useState } from 'react';

const TrendingSearches = () => {
  // Mock trending searches data
  const trendingSearches = [
    { id: 1, text: 'Currently trending topic in korea', rank: 1, change: 'up' },
    { id: 2, text: 'Currently trending topic seoul', rank: 2, change: 'up' },
    { id: 3, text: 'Currently trending topic busan', rank: 3, change: 'up' },
    { id: 4, text: 'Currently trending topic gangnam', rank: 4, change: 'up' },
    { id: 5, text: 'Currently trending topic in korea', rank: 5, change: 'up' },
    { id: 6, text: 'Currently trending topic in korea', rank: 6, change: 'up' },
    { id: 7, text: 'Currently trending topic in korea', rank: 7, change: 'up' },
    { id: 8, text: 'Currently trending topic in korea', rank: 8, change: 'up' },
    { id: 9, text: 'Currently trending topic in korea', rank: 9, change: 'up' },
    { id: 10, text: 'Currently trending topic in korea', rank: 10, change: 'up' },
  ];

  // Two-page carousel: first 5 then next 5
  const pages = [
    trendingSearches.slice(0, 5),
    trendingSearches.slice(5, 10),
  ];
  const [page, setPage] = useState(0);

  return (
    <Box
      elevation={3}
      sx={{
        p: 1,
        border: '0',
        backgroundColor: '#fff',
        height: 244,
        width: 260,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', mb: 1 }}>
        <Bolt sx={{ color: '#ff4757', mr: 1, fontSize: 18 }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#ff4757',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Trending
        </Typography>
      </Box>

      {/* Trending List (page content) */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
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
              py: 0.6,
              cursor: 'pointer',
              // Minimal hover to keep colors but avoid layout shift
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1,
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
                  minWidth: '16px',
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
    </Box>
  );
};

export default TrendingSearches;
