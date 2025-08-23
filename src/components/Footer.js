import React from 'react';
import {
  Box,
  Container,
  Link,
  useTheme,
} from '@mui/material';

const Footer = ({ floating = false, stickToBottom = true }) => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.default, // match home page background
        py: 2,
        ...(floating ? {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        } : (
          stickToBottom ? { mt: 'auto' } : {}
        )),
        // borderTop removed per request
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center', // center align all items
            alignItems: 'center',
            gap: '55px',
            flexWrap: 'wrap', // allow wrapping on small screens while staying centered
            textAlign: 'center',
          }}
        >
          {/* Updated links per new design */}
          <Link 
            href="/about"
            underline="hover"
            variant="body2"
            sx={{
              color: '#888',
              textAlign: 'center',
              fontFamily: 'Metropolis',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: 500,
              '&:hover': { color: '#888' }
            }}
          >
            About Us
          </Link>
          <Link 
            href="/business"
            underline="hover"
            variant="body2"
            sx={{
              color: '#888',
              textAlign: 'center',
              fontFamily: 'Metropolis',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: 500,
              '&:hover': { color: '#888' }
            }}
          >
            Business
          </Link>
          <Link 
            href="/contact"
            underline="hover"
            variant="body2"
            sx={{
              color: '#888',
              textAlign: 'center',
              fontFamily: 'Metropolis',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: 500,
              '&:hover': { color: '#888' }
            }}
          >
            Contact Us
          </Link>
          <Link 
            href="/privacy"
            underline="hover"
            variant="body2"
            sx={{
              color: '#888',
              textAlign: 'center',
              fontFamily: 'Metropolis',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: 500,
              '&:hover': { color: '#888' }
            }}
          >
            Privacy
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
