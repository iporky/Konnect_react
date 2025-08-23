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
            gap: 3,
            flexWrap: 'wrap', // allow wrapping on small screens while staying centered
            textAlign: 'center',
          }}
        >
          {/* Updated links per new design */}
          <Link 
            href="/about"
            color="#888888"
            underline="hover"
            fontSize={10}
            variant="body2"
            sx={{ '&:hover': { color: 'primary.main' } }}
          >
            About Us
          </Link>
          <Link 
            href="/business"
            color="#888888"
            underline="hover"
            fontSize={10}
            variant="body2"
            sx={{ '&:hover': { color: 'primary.main' } }}
          >
            Business
          </Link>
          <Link 
            href="/contact"
            color="#888888"
            underline="hover"
            fontSize={10}
            variant="body2"
            sx={{ '&:hover': { color: 'primary.main' } }}
          >
            Contact Us
          </Link>
          <Link 
            href="/privacy"
            color="#888888"
            underline="hover"
            fontSize={10}
            variant="body2"
            sx={{ '&:hover': { color: 'primary.main' } }}
          >
            Privacy
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
