import { Box, Container, Link, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer = ({ floating = false, stickToBottom = true }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

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
            onClick={() => handleNavigation('/about')}
            underline="hover"
            variant="body2"
            sx={{
              color: '#888',
              textAlign: 'center',
              fontFamily: 'Metropolis',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { color: '#888', cursor: 'pointer' }
            }}
          >
            About Us
          </Link>
          <Link 
            onClick={() => handleNavigation('/business')}
            underline="hover"
            variant="body2"
            sx={{
              color: '#888',
              textAlign: 'center',
              fontFamily: 'Metropolis',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { color: '#888', cursor: 'pointer' }
            }}
          >
            Business
          </Link>
          <Link 
            onClick={() => handleNavigation('/contact')}
            underline="hover"
            variant="body2"
            sx={{
              color: '#888',
              textAlign: 'center',
              fontFamily: 'Metropolis',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { color: '#888', cursor: 'pointer' }
            }}
          >
            Contact Us
          </Link>
          <Link 
            onClick={() => handleNavigation('/privacy')}
            underline="hover"
            variant="body2"
            sx={{
              color: '#888',
              textAlign: 'center',
              fontFamily: 'Metropolis',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { color: '#888', cursor: 'pointer' }
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
