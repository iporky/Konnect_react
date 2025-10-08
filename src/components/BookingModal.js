import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, TextField, Typography } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useState } from 'react';

const BookingModal = ({ open, onClose, onBookingSuccess, recommendation }) => {
  const [bookingForm, setBookingForm] = useState({
    email: '',
    date: null,
    time: null,
    guests: 1
  });

  const handleClose = () => {
    setBookingForm({ email: '', date: null, time: null, guests: 1 });
    onClose();
  };

  const handleSubmit = () => {
    // Validate form
    if (!bookingForm.email || !bookingForm.date || !bookingForm.time) {
      return;
    }

    // Simulate booking submission
    console.log('Booking submitted:', {
      ...bookingForm,
      recommendation: recommendation?.title || 'Unknown'
    });

    // Call success callback with booking details
    onBookingSuccess && onBookingSuccess({
      ...bookingForm,
      recommendation: recommendation
    });

    handleClose();
  };

  const isFormValid = bookingForm.email && bookingForm.date && bookingForm.time;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box sx={{ px: 2.5, py: 1.5, backgroundColor: '#3289C9', color: '#fff' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
            Book Your Experience
          </Typography>
          {recommendation?.title && (
            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
              {recommendation.title}
            </Typography>
          )}
        </Box>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={bookingForm.email}
              onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
              required
              error={!bookingForm.email && bookingForm.email !== ''}
              helperText={!bookingForm.email && bookingForm.email !== '' ? 'Email is required' : ''}
            />
            
            <DatePicker
              label="Select Date"
              value={bookingForm.date}
              onChange={(newValue) => setBookingForm(prev => ({ ...prev, date: newValue }))}
              enableAccessibleFieldDOMStructure={false}
              slots={{
                textField: TextField
              }}
              slotProps={{
                textField: { 
                  fullWidth: true, 
                  required: true,
                  error: !bookingForm.date,
                  helperText: !bookingForm.date ? 'Date is required' : ''
                }
              }}
              minDate={dayjs()}
            />
            
            <TimePicker
              label="Select Time"
              value={bookingForm.time}
              onChange={(newValue) => setBookingForm(prev => ({ ...prev, time: newValue }))}
              enableAccessibleFieldDOMStructure={false}
              slots={{
                textField: TextField
              }}
              slotProps={{
                textField: { 
                  fullWidth: true, 
                  required: true,
                  error: !bookingForm.time,
                  helperText: !bookingForm.time ? 'Time is required' : ''
                }
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Number of Guests:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  onClick={() => setBookingForm(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                  size="small"
                  disabled={bookingForm.guests <= 1}
                  sx={{ 
                    border: '1px solid #ddd',
                    width: 32,
                    height: 32
                  }}
                >
                  -
                </IconButton>
                <Typography sx={{ minWidth: '30px', textAlign: 'center', fontWeight: 500 }}>
                  {bookingForm.guests}
                </Typography>
                <IconButton 
                  onClick={() => setBookingForm(prev => ({ ...prev, guests: prev.guests + 1 }))}
                  size="small"
                  sx={{ 
                    border: '1px solid #ddd',
                    width: 32,
                    height: 32
                  }}
                >
                  +
                </IconButton>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!isFormValid}
            sx={{
              backgroundColor: isFormValid ? '#f39232' : undefined,
              '&:hover': {
                backgroundColor: isFormValid ? '#e8851f' : undefined
              }
            }}
          >
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default BookingModal;