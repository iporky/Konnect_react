import { Box, Chip, Typography } from '@mui/material';

const FollowupQuestionsTemplate = ({ content, onFollowUpClick }) => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
      Continue exploring
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
      {content.map((question, index) => (
        <Chip
          key={index}
          label={question}
          onClick={() => onFollowUpClick(question)}
          clickable
          sx={{
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid #e0e0e0',
            borderRadius: '20px',
            px: 2,
            py: 1,
            height: 'auto',
            '&:hover': {
              backgroundColor: '#3289C9',
              color: 'white',
              borderColor: '#3289C9'
            },
            '&:active': {
              backgroundColor: '#2874a6'
            }
          }}
        />
      ))}
    </Box>
  </Box>
);

export default FollowupQuestionsTemplate;