import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

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

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1,
        borderRadius: '25px',
        backgroundColor: '#fff',
        height: 240,
        width: 260,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 0px 4px 0px #00000040',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrendingUp sx={{ color: '#ff4757', mr: 1, fontSize: 18 }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            color: '#ff4757',
            fontSize: '15px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Trending searches
        </Typography>
      </Box>

      {/* Trending List */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1.5, 
        flex: 1,
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': {
          width: 4,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'divider',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'text.secondary',
          },
        },
      }}>
        {trendingSearches.map((item) => (
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
    </Paper>
  );
};

export default TrendingSearches;
