import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingTemplate = () => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 2, 
    py: 2, 
    color: '#666' 
  }}>
    <CircularProgress size={16} sx={{ color: '#3289C9' }} />
    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
      Analyzing your query...
    </Typography>
  </Box>
);

export default LoadingTemplate;