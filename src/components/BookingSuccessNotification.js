import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Snackbar, Typography } from '@mui/material';

const BookingSuccessNotification = ({ open, onClose, bookingDetails }) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        top: '16px !important'
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          color: '#333',
          border: '1px solid #4caf50',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: 2,
          padding: 2,
          minWidth: 400,
          maxWidth: 600,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1
        }}
      >
        <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 24, mt: 0.25 }} />
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Booking Confirmed!
          </Typography>
          {bookingDetails && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Your booking has been confirmed.
              Details sent to {bookingDetails.email}.
            </Typography>
          )}
        </Box>
        
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
          sx={{ mt: -0.5, mr: -0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default BookingSuccessNotification;