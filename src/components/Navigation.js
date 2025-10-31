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
  useTheme as useMuiTheme,
  InputBase
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllSupportedLanguages } from '../utils/speechLanguages';
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
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageQuery, setLanguageQuery] = useState('');
  
  // Use language context
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  
  // Get supported languages for speech recognition
  const supportedLanguages = getAllSupportedLanguages();

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
      path: isMobile ? '/language' : null, 
      requireAuth: false 
    },
    // Admin item intentionally removed from visible navigation; route still accessible directly via URL.
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
              <img src={`${process.env.PUBLIC_URL || ''}/images/Konnect_k_logo.png`} alt="Konnect K" style={{ width: 44, height: 44 }} />
            </Box>
          </Box>

          <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%', pb: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, py: 2, mb: 4 }}>
              <Typography variant="caption" sx={{ cursor: 'pointer' }} onClick={() => { navigate('/about'); setMobileOpen(false); }}>About Us</Typography>
              <Typography variant="caption" sx={{ cursor: 'pointer' }} onClick={() => { navigate('/business'); setMobileOpen(false); }}>Business</Typography>
              <Typography variant="caption" sx={{ cursor: 'pointer' }} onClick={() => { navigate('/contact'); setMobileOpen(false); }}>Contact Us</Typography>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
  <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '66px',
          height: '100vh',
          // remove sidebar border
          borderRight: 'none',
          display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
          flexDirection: 'column',
          alignItems: 'center',
          py: '35px',
          zIndex: 1000,
        }}
      >
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          cursor: 'pointer',
          pl: 0.8
        }}
        onClick={() => navigate('/')}
        >
          <img 
            src={`${process.env.PUBLIC_URL || ''}/images/Konnect_k_logo.png`} 
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
        pl: 0.8,
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.6 + (index * 0.1), // Staggered animation
                ease: "easeOut" 
              }}
              style={{ width: '100%' }}
            >
              <ListItem disablePadding sx={{ width: '100%', mb: 0 }}>
                <ListItemButton
                  onClick={() => {
                    if (item.text === 'Language' && !isMobile) {
                      setLanguageOpen(true);
                      return;
                    }
                    handleNavigation(item.path);
                  }}
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
                      right: -8, // extend into the 8px gap so it touches the white page
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

      {/* Avatar at bottom - only show when user is authenticated */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 1.0, // Appear after navigation items
            ease: "easeOut" 
          }}
        >
          <Box
            onClick={() => navigate('/profile')}
            sx={{
              cursor: 'pointer',
              mb: 2,
              ml: 0.4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              '&:hover .avatar-image': {
                transform: 'scale(1.1)',
              }
            }}
          >
            <Box
              className="avatar-image"
              component="img"
              src="https://picsum.photos/40/40?random=1"
              alt="User Avatar"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e0e0e0',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  border: '2px solid #6F95BD',
                }
              }}
            />
          </Box>
        </motion.div>
      )}
    </Box>

    {/* Desktop Language Drawer overlay */}
    {languageOpen && (
      <>
        {/* Backdrop */}
        <Box
          onClick={() => setLanguageOpen(false)}
          sx={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.08)',
            zIndex: 1200,
          }}
        />
        {/* Drawer Panel */}
        <Box
          role="dialog"
          aria-label="Language selector"
          sx={{
            position: 'fixed',
            top: { xs: 72, md: 8 },
            bottom: 8,
            left: { xs: 8, md: 74 },
            width: 260,
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: '0px 12px 24px rgba(0,0,0,0.18)',
            zIndex: 1300,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Search */}
          <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.16)',
                bgcolor: '#fff',
              }}
            >
              <SearchIcon sx={{ color: 'text.disabled' }} />
              <InputBase
                placeholder="Search languages..."
                value={languageQuery}
                onChange={(e) => setLanguageQuery(e.target.value)}
                sx={{ fontSize: 14, width: '100%' }}
              />
            </Box>
          </Box>

          {/* Language list */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {
            supportedLanguages
              .filter((lang) => lang.displayName.toLowerCase().includes(languageQuery.toLowerCase()))
              .map((lang, idx, arr) => {
                const isSelected = selectedLanguage === lang.displayName;
                
                return (
                  <Box 
                    key={lang.displayName} 
                    onClick={() => {
                      setSelectedLanguage(lang.displayName);
                      setLanguageOpen(false);
                      console.log(`Language changed to: ${lang.displayName} (${lang.code})`);
                    }} 
                    sx={{ 
                      px: 2, 
                      py: 1.75, 
                      borderBottom: idx < arr.length - 1 ? '1px solid' : 'none', 
                      borderColor: 'divider', 
                      cursor: 'pointer', 
                      backgroundColor: isSelected ? '#6F95BD' : 'transparent',
                      '&:hover': { 
                        bgcolor: isSelected ? '#6F95BD' : 'grey.50' 
                      }
                    }}
                  >
                    <Typography sx={{ 
                      fontSize: 14,
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? 'white' : 'text.primary'
                    }}>
                      {lang.displayName}
                    </Typography>
                  </Box>
                );
              })
            }
          </Box>
        </Box>
      </>
    )}
    </motion.div>
  );
};

export default Navigation;
