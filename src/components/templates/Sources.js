import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Sources = ({ sources, onSourcesClick }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <Button
      variant="outlined"
      onClick={onSourcesClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 0.8,
        borderRadius: '50px',
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        color: '#333',
        textTransform: 'none',
        minWidth: 'auto',
        height: 32,
        '&:hover': {
          borderColor: '#3289C9',
          backgroundColor: '#f0f7ff'
        }
      }}
    >
      {/* Korean Flag Icon */}
      <Box
        sx={{
          width: 16,
          height: 12,
          background: 'linear-gradient(to bottom, #CD2E3A 50%, #0047A0 50%)',
          borderRadius: 0.5
        }}
      />
      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
        Answer source
      </Typography>
    </Button>
  );
};

export default Sources;