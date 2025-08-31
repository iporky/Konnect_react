import React, { useState } from 'react';
import { Box, Button, Container, Stack, TextField, Typography, useTheme } from '@mui/material';

const Contact = () => {
  const theme = useTheme();
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up API
    // For now, no-op
  };

  return (
  <Box sx={{ color: theme.palette.text.primary, display: 'flex', flexDirection: 'column', alignItems: 'stretch', pb: { xs: 6, md: 10, lg: 14 } }}>
      <Container
        maxWidth="lg"
        sx={{
          ml: { xs: 0, md: 20 },
          py: 6,
          minHeight: { xs: 'calc(100vh - 64px)', md: '95vh' },
        }}
      >
        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              color: '#1E4485',
              fontFamily: 'Metropolis',
              fontWeight: 700,
              fontSize: { xs: '32px', md: '56px' },
              lineHeight: 1.1,
              letterSpacing: { xs: '-0.32px', md: '-0.56px' },
            }}
          >
            Contact{' '}
            <Box component="span" sx={{ color: '#DB6067', fontStyle: 'italic' }}>Us</Box>
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5} sx={{ maxWidth: 520 }}>
            <TextField
              name="name"
              placeholder="Contact name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ sx: { borderRadius: '35px', '& fieldset': { borderRadius: '35px' } } }}
            />
            <TextField
              name="company"
              placeholder="Company name"
              value={form.company}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ sx: { borderRadius: '35px', '& fieldset': { borderRadius: '35px' } } }}
            />
            <TextField
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ sx: { borderRadius: '35px', '& fieldset': { borderRadius: '35px' } } }}
            />
            <TextField
              name="email"
              placeholder="Email ID"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ sx: { borderRadius: '35px', '& fieldset': { borderRadius: '35px' } } }}
            />
            <TextField
              name="message"
              placeholder="Write your comment here"
              value={form.message}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              multiline
              minRows={5}
              InputProps={{ sx: { borderRadius: '35px', '& fieldset': { borderRadius: '35px' } } }}
            />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 999, px: 3, py: 1.2, textTransform: 'none', fontWeight: 700 }}>
                Send it to Us!
              </Button>
              <Typography sx={{ color: '#DB6067', fontStyle: 'italic', fontFamily: 'Metropolis', textAlign: { xs: 'center', sm: 'left' } }}>
                We will get back to you soon!
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
