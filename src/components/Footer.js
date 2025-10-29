import { Box, Container, Link, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const Footer = ({ floating = false, stickToBottom = true }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Memoized navigation items for better performance
  const navigationItems = useMemo(() => [
    { path: '/about', label: 'About Us' },
    { path: '/business', label: 'Business' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/privacy', label: 'Privacy' }
  ], []);

  // Memoized common link styles to avoid recreation on every render
  const linkStyles = useMemo(() => ({
    color: '#888',
    textAlign: 'center',
    fontFamily: 'Metropolis',
    fontSize: '13px',
    fontStyle: 'normal',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': { 
      color: '#888', 
      cursor: 'pointer' 
    }
  }), []);

  // Memoized footer container styles
  const footerStyles = useMemo(() => ({
    backgroundColor: theme.palette.background.default,
    py: .5,
    ...(floating ? {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    } : (
      stickToBottom ? { mt: 'auto' } : {}
    )),
  }), [theme.palette.background.default, floating, stickToBottom]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box component="footer" sx={footerStyles}>
      <Container maxWidth="lg">
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '55px',
            flexWrap: 'wrap',
            textAlign: 'center',
          }}
        >
          {navigationItems.map(({ path, label }) => (
            <Link 
              key={path}
              onClick={() => handleNavigation(path)}
              variant="body2"
              sx={linkStyles}
            >
              {label}
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
