import React, { useState } from 'react';
import { Box, Button, Container, Stack, TextField, Typography, useTheme, CircularProgress } from '@mui/material';
import api from '../services/api';

const Contact = () => {
  const theme = useTheme();
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.company.trim()) errs.company = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    if (!form.message.trim()) errs.message = 'Required';
    // Basic email format check
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/business/', {
        company_name: form.company,
        contact_name: form.name,
        email: form.email,
        phone: form.phone,
        comment: form.message,
      });
      setSubmitted(true);
      setForm({ name: '', company: '', phone: '', email: '', message: '' });
    } catch (err) {
      setServerError(err?.response?.data?.message || err?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
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
              required
              error={!!errors.name}
              helperText={errors.name || ' '}
              variant="outlined"
              InputProps={{ sx: { borderRadius: '35px', '& fieldset': { borderRadius: '35px' } } }}
            />
            <TextField
              name="company"
              placeholder="Company name"
              value={form.company}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.company}
              helperText={errors.company || ' '}
              variant="outlined"
              InputProps={{ sx: { borderRadius: '35px', '& fieldset': { borderRadius: '35px' } } }}
            />
            <TextField
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.phone}
              helperText={errors.phone || ' '}
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
              required
              error={!!errors.email}
              helperText={errors.email || ' '}
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
              required
              error={!!errors.message}
              helperText={errors.message || ' '}
              InputProps={{ sx: { borderRadius: '35px', '& fieldset': { borderRadius: '35px' } } }}
            />

            {serverError && (
              <Typography color="error" variant="body2">{serverError}</Typography>
            )}

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
              <Button type="submit" disabled={loading} variant="contained" color="primary" sx={{ borderRadius: 999, px: 3, py: 1.2, textTransform: 'none', fontWeight: 700, position: 'relative' }}>
                {loading ? 'Sending...' : 'Send it to Us!'}
                {loading && <CircularProgress size={20} sx={{ position: 'absolute', right: 12, top: '50%', mt: '-10px' }} />}
              </Button>
              {submitted && (
                <Typography sx={{ color: '#DB6067', fontStyle: 'italic', fontFamily: 'Metropolis', textAlign: { xs: 'center', sm: 'left' } }}>
                  We will get back to you soon!
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
