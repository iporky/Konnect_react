import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Business = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Business
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This is a placeholder page for Business. Add your content here.
      </Typography>
    </Container>
  );
};

export default Business;
