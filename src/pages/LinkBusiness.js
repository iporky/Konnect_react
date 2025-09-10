import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { businessCardsAPI } from '../services/api';

const LinkBusiness = () => {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setCompanyName('');
    setPhone('');
    setEmail('');
    setFile(null);
    setError('');
    setSuccess('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!companyName || !email || !file) {
      setError('Company name, email, and file are required');
      return;
    }
    setSubmitting(true);
    try {
      await businessCardsAPI.upload({ company_name: companyName, phone_number: phone, email, file });
      setSuccess('Uploaded successfully');
      setTimeout(() => { setOpen(false); resetForm(); }, 1200);
    } catch (err) {
      console.error('Upload failed', err);
      setError(err?.response?.data?.detail || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 4, md: 6 },
        px: { xs: 3, md: 0 },
        textAlign: { xs: 'center', md: 'left' },
        ml: { xs: 0, md: 10 },
      }}
    >
      {/* Title */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'Metropolis',
            fontWeight: 700,
            fontSize: { xs: '34px', md: '48px' },
            color: '#1E4485',
            lineHeight: 1.15,
          }}
        >
          List Your
          <Box component="span" sx={{ color: '#DB6067', fontStyle: 'italic' }}>Business</Box>
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1.5, fontSize: { xs: 14, md: 16 }, maxWidth: { xs: 320, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
          Add your listed business from existing platforms (like Naver or Google)
        </Typography>
      </Box>

      {/* URL Input pill */}
      <Box sx={{ maxWidth: { xs: 560, md: '560px' }, mx: { xs: 'auto', md: 0 }, mt: { xs: 2, md: 0 } }}>
        <TextField
          placeholder="Enter URL of your business from existing platforms like Google or Naver"
          fullWidth
          variant="outlined"
          size="medium"
          InputProps={{
            sx: {
              borderRadius: '28px',
              '& fieldset': { borderRadius: '28px', borderColor: '#E6E7EB' },
              '&:hover fieldset': { borderColor: '#D6D7DB' },
              '& .MuiOutlinedInput-input': { py: 1.3, fontSize: 14 },
              '& input::placeholder': { color: '#9AA2AE', opacity: 1 },
            },
          }}
        />
      </Box>

      {/* OR */}
      <Box sx={{ my: { xs: 3.5, md: 4 } }}>
        <Typography sx={{ color: 'text.disabled', fontStyle: 'italic', fontWeight: 700 }}>
          OR
        </Typography>
      </Box>

      {/* Add card row with Upload button */}
      <Box sx={{ maxWidth: 720, mx: { xs: 'auto', md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'center' }, gap: 2, mb: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: 14, md: 16 } }}>
            Add your business card
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 999, px: 2.5, py: 0.6, textTransform: 'none', fontWeight: 700, minWidth: 112 }}
            onClick={() => { resetForm(); setOpen(true); }}
          >
            Upload here
          </Button>
        </Box>
        <Typography sx={{ color: 'text.secondary', fontSize: 11, maxWidth: { xs: 280, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
          Ensure that your contact information is present and correct before upload.
        </Typography>
      </Box>

      {/* Primary CTA */}
      <Box sx={{ mt: { xs: 4, md: 4 }, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 999,
            px: 3,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 700,
            minWidth: 240,
            fontSize: 16,
          }}
        >
          Send it to Us!
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 600, pr: 5 }}>
          Upload Business Card
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleUpload} id="business-card-upload-form">
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              <TextField
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <Button
                variant="outlined"
                component="label"
                sx={{ justifyContent: 'flex-start' }}
              >
                {file ? file.name : 'Select Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Supported: JPG, PNG. Max 5MB.
              </Typography>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
          <Button type="submit" form="business-card-upload-form" variant="contained" disabled={submitting}>
            {submitting ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LinkBusiness;
