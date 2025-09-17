import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

const FollowUpQuestions = ({ questions, onQuestionClick }) => {
  const theme = useTheme();

  if (!questions || questions.length === 0) return null;

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HelpOutline sx={{ color: '#3289C9', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3289C9' }}>
          Follow-up Questions
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outlined"
            size="small"
            onClick={() => onQuestionClick?.(question)}
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: '#333',
              '&:hover': {
                borderColor: '#3289C9',
                backgroundColor: '#f0f7ff'
              }
            }}
          >
            {question}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default FollowUpQuestions;