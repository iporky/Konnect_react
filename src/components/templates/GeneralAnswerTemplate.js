import { Box, Typography } from '@mui/material';

const GeneralAnswerTemplate = ({ content }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#444' }}>
      {content}
    </Typography>
  </Box>
);

export default GeneralAnswerTemplate;