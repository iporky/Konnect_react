import { Box, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const LoadingTemplate = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      py: 2, 
      color: '#666' 
    }}>
      <CircularProgress size={16} sx={{ color: '#3289C9' }} />
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
        Finding best matches for you{dots}
      </Typography>
    </Box>
  );
};

export default LoadingTemplate;