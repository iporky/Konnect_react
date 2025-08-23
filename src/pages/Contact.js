import React from 'react';
import { Container, Typography } from '@mui/material';

const Contact = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This is a placeholder page for Contact Us. Add your content and a contact form here.
      </Typography>
    </Container>
  );
};

export default Contact;
