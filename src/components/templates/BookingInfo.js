import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Event, Language } from '@mui/icons-material';

const BookingInfo = ({ bookingInfo }) => {
  if (!bookingInfo) return null;

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#e8f5e8', borderRadius: 2, border: '1px solid #4caf50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Event sx={{ color: '#2e7d32', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
          Booking Information
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {bookingInfo.booking_link && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Language sx={{ fontSize: 16, color: '#666' }} />
            <Link 
              href={bookingInfo.booking_link} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ color: '#2e7d32', fontWeight: 500 }}
            >
              Book Online
            </Link>
          </Box>
        )}
        {bookingInfo.phone && (
          <Typography variant="body2" sx={{ color: '#333' }}>
            <strong>Phone:</strong> {bookingInfo.phone}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BookingInfo;