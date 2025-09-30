import { Box, Paper, Typography } from '@mui/material';

const FollowupQuestionsTemplate = ({ content, onFollowUpClick }) => (
  <Box sx={{ mt: 0 }}>
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      flexWrap: 'wrap',
      '@media (max-width: 600px)': {
        flexDirection: 'column'
      }
    }}>
      {content.slice(0, 3).map((question, index) => (
        <Paper
          key={index}
          elevation={1}
          onClick={() => onFollowUpClick(question)}
          sx={{
            px: 1.5,
            py: 1.5,
            borderRadius: 3,
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
            flex: '1 1 0',
            minWidth: 0,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#e0e0e0',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            },
            '&:active': {
              transform: 'translateY(0)',
              backgroundColor: '#d5d5d5'
            }
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#333',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.4,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {question}
          </Typography>
        </Paper>
      ))}
    </Box>
  </Box>
);

export default FollowupQuestionsTemplate;