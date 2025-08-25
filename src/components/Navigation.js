import {
  AccountCircle,
  Menu as MenuIcon
} from '@mui/icons-material';
import {
  AppBar,
  BottomNavigation,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CustomBuzzIcon,
  CustomHomeIcon,
  CustomLanguageIcon,
  CustomLibraryIcon
} from './CustomIcons';


const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { 
      text: 'Home', 
      icon: <CustomHomeIcon selected={location.pathname === '/'} />, 
      path: '/', 
      requireAuth: false 
    },
    { 
      text: 'Buzz', 
      icon: <CustomBuzzIcon selected={location.pathname === '/buzz'} />, 
      path: '/buzz', 
      requireAuth: false 
    },
    { 
      text: 'Library', 
      icon: <CustomLibraryIcon selected={location.pathname === '/library'} />, 
      path: '/library', 
      requireAuth: false 
    },
    { 
      text: 'Language', 
      icon: <CustomLanguageIcon selected={location.pathname === '/language'} />, 
      path: '/language', 
      requireAuth: false 
  },
  ];

  const handleNavigation = (path) => {
    if (path) navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile Navigation (Bottom Navigation)
  if (isMobile) {    
    return (
      <>
        {/* Mobile App Bar */}
        <AppBar position="fixed" sx={{ display: { xs: 'block', md: 'none' } }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box />
            <IconButton
              color="inherit"
              aria-label="user"
              edge="end"
              onClick={() => navigate(user ? '/profile' : '/login')}
            >
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: '100vw',
              height: '100vh',
              backgroundColor: '#FFF4F4',
            },
          }}
        >
          {/* Drawer Header with close icon and clickable Konnect K logo */}
          <Box sx={{ position: 'relative', py: 3 }}>
            <IconButton
              aria-label="close menu"
              onClick={handleDrawerToggle}
              sx={{ position: 'absolute', left: 12, top: 12 }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              onClick={() => { navigate('/'); setMobileOpen(false); }}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <img src="/images/Konnect_k_logo.png" alt="Konnect K" style={{ width: 44, height: 44 }} />
            </Box>
          </Box>

          <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Centered nav items */}
            <List sx={{ flex: 1, px: 3 }}>
              {(() => {
                const listItems = menuItems.filter(mi => mi.path && (!mi.requireAuth || user));
                return listItems.map((item, idx) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Box key={item.text} sx={{ py: 2 }}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => handleNavigation(item.path)}
                          disableRipple
                          sx={{ flexDirection: 'column', alignItems: 'center', p: 0 }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                            <Box sx={{ color: isActive ? 'primary.main' : 'text.disabled' }}>{item.icon}</Box>
                            <Typography sx={{ fontWeight: 700, color: isActive ? 'primary.main' : 'text.disabled', letterSpacing: 1, textAlign: 'center' }}>
                              {item.text.toUpperCase()}
                            </Typography>
                          </Box>
                          {/* Active underline centered */}
                          <Box sx={{ height: 2, width: '70%', maxWidth: 220, backgroundColor: isActive ? '#CD2028' : 'transparent', mt: 1, mx: 'auto' }} />
                        </ListItemButton>
                      </ListItem>
                      {/* Centered separator */}
                      {idx < listItems.length - 1 && (
                        <Box sx={{ height: 1, backgroundColor: 'divider', width: '70%', maxWidth: 260, mx: 'auto', mt: 2 }} />
                      )}
                    </Box>
                  );
                });
              })()}
            </List>

            {/* Bottom links centered inside drawer */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, py: 2, borderTop: '1px solid', borderTopColor: 'divider' }}>
              <Typography variant="caption" sx={{ cursor: 'pointer' }} onClick={() => { navigate('/about'); setMobileOpen(false); }}>About Us</Typography>
              <Typography variant="caption" sx={{ cursor: 'pointer' }} onClick={() => { navigate('/contact'); setMobileOpen(false); }}>Contact Us</Typography>
              <Typography variant="caption" sx={{ cursor: 'pointer' }} onClick={() => { navigate('/terms'); setMobileOpen(false); }}>Terms</Typography>
              <Typography variant="caption" sx={{ cursor: 'pointer' }} onClick={() => { navigate('/privacy'); setMobileOpen(false); }}>Privacy</Typography>
            </Box>
          </Box>
        </Drawer>

        {/* Bottom Navigation remains as-is or can be hidden; keeping off per mock */}
        <BottomNavigation sx={{ display: 'none' }} />
      </>
    );
  }

  // Desktop Navigation (Sidebar)
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '66px',
          height: '100vh',
          backgroundColor: '#CF202A0D',
          borderRight: `1px solid ${muiTheme.palette.divider}`,
          display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
          flexDirection: 'column',
          alignItems: 'center',
          py: '35px',
          zIndex: 1000,
        }}
      >
      {/* Logo Section */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
        >
          <img 
            src="/images/Konnect_k_logo.png" 
            alt="Konnect Logo" 
            style={{ 
              height: '37px',
              width: '37px',
              objectFit: 'contain',
              marginBottom: '25px'
            }}
          />
        </Box>
      </motion.div>

      {/* Navigation Menu */}
      <List sx={{ 
        flex: 1, 
        width: '100%',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // Center the navigation items vertically
        gap: '24px', // total gap between each icon
      }}>
        {menuItems.map((item, index) => {
          if (item.requireAuth && !user) return null;
          
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.text}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.6 + (index * 0.1), // Staggered animation
                ease: "easeOut" 
              }}
              style={{ width: '100%' }}
            >
              <ListItem disablePadding sx={{ width: '100%', mb: 0 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 0,
                    px: 0,
                    minHeight: 'auto',
                    borderRadius: 0,
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '& .nav-icon': { color: '#6F95BD' },
                      '& .nav-text': { color: '#6F95BD' }
                    },
                    '&::before': (isActive && item.path) ? {
                      content: '""',
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '45px',
                      width: '3px',
                      backgroundColor: '#CD2028',
                    } : {},
                  }}
                >
                  <Box
                    className="nav-icon"
                    sx={{
                      color: (isActive && item.path) ? '#6F95BD' : muiTheme.palette.text.secondary,
                      mb: 0.5,
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography 
                    className="nav-text"
                    variant="caption"
                    sx={{
                      color: (isActive && item.path) ? '#6F95BD' : '#CFCFCF',
                      textAlign: 'center',
                      fontFamily: 'Metropolis',
                      fontSize: '11px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    {item.text}
                  </Typography>
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>
    </Box>
    </motion.div>
  );
};

export default Navigation;
