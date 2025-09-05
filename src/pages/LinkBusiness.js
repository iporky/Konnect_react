import { Box, Button, Container, TextField, Typography } from '@mui/material';

const LinkBusiness = () => {
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
    </Container>
  );
};

export default LinkBusiness;
