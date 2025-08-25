// Add outlined icons for search bar toggles
import AddRounded from '@mui/icons-material/AddRounded';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import FeedbackOutlined from '@mui/icons-material/FeedbackOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import MicOutlined from '@mui/icons-material/MicOutlined';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import School from '@mui/icons-material/School';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import {
  Box,
  Button,
  Container,
  IconButton,
  Tooltip,
  Paper,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuzzCarousel from '../components/BuzzCarousel';
import Footer from '../components/Footer';
import TrendingSearches from '../components/TrendingSearches';

const categoryIcons = [
  { icon: "/images/plan-trip.png", label: "Plan Trip", color: "#8888881A" },
  { icon: "/images/local-buzz.png", label: "Local Buzz", color: "#8888881A" },
  { icon: "/images/food.png", label: "Food", color: "#8888881A" },
  { icon: "/images/community.png", label: "Community", color: "#8888881A" },
  { icon: "/images/culture.png", label: "Culture", color: "#8888881A" },
  { icon: "/images/services.png", label: "Services", color: "#8888881A" },
  { icon: "/images/people.png", label: "People", color: "#8888881A" },
  { icon: "/images/explore.png", label: "Explore", color: "#8888881A" },
  { icon: "/images/student.png", label: "Student", color: "#ffffff1a", Icon: School }
];

const Home = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = useTheme();
  const searchInputRef = useRef(null);

  // Right-side icons in the search bar: toggle to highlight active; hover also highlights
  const [searchToggles, setSearchToggles] = useState({
    group: false,
    badge: false,
    globe: false,
    attach: false,
    mic: false,
  });
  const toggleIcon = (key) => setSearchToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  // Mobile: show more categories when tapping the three dots
  const [showAllCategories, setShowAllCategories] = useState(false);
  // Desktop: number of category tiles visible before the "More" tile
  const DESKTOP_VISIBLE = 6; // collapsed: 6 + More = 7 tiles in row 1
  const ROW1_COUNT = 7; // expanded: always keep 7 real icons on the top row

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleSearchFocus = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Navigate to login when user starts typing
    if (value.trim() && !isAuthenticated) {
      navigate('/login');
    }
  };

  const handleCategoryClick = (category) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Navigate to category page or handle search
    console.log('Category clicked:', category);
  };

  return (
    <>
      <Box sx={{ 
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        ml: { xs: 0, md: '66px' },
        minHeight: '100vh',
        borderRadius: { xs: 0, md: '30px' },
        overflowX: 'hidden',
        // Allow page scroll on desktop when the second row of tiles is expanded
        overflowY: { xs: 'hidden', md: showAllCategories ? 'auto' : 'auto' },
        position: 'relative'
      }}>
        {/* Header with Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 3}, position: 'relative', mb: { xs: 6, md: '76px' }, mt: { xs: 2, md: '126px' }   }}>
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src="/images/Konnect_logo.png" 
                alt="Konnect" 
                style={{ height: '65px', width: '450'}}
              />
              {/* Tagline for mobile as in mock */}
              <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1, display: { xs: 'block', md: 'none' }, fontFamily: 'cursive' }}>
                with Korea
              </Typography>
            </Box>
          </motion.div>
          
          {/* Desktop: top-right auth buttons */}
          {!isAuthenticated && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}>
              <Box
                sx={{
                  position: 'fixed',
                  top: 25,
                  right: 45,
                  display: { xs: 'none', md: 'flex' },
                  gap: 1,
                  zIndex: 1200,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    borderRadius: '25px',
                    px: 2.5,
                    height: '45px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: 'Metropolis',
                    fontStyle: 'normal',
                    fontSize: '14px',
                    backgroundColor: '#121212',
                    color: '#ffffff',
                    border: '1px solid #121212',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#121212',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Sign up for free
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: '25px',
                    px: 2.5,
                    height: '45px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: 'Metropolis',
                    fontStyle: 'normal',
                    fontSize: '14px',
                    border: '1px solid #888888',
                    color: '#888888',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  log in
                </Button>
              </Box>
            </motion.div>
          )}
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ flex: 1, px: 2, pt: 1, pb: { xs: 0, md: showAllCategories ? 2 : 10 } }}>
          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 0, md: '25px' } }}>
              <Paper
                elevation={6}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: { xs: '90%', md: '660px' },
                  maxWidth: { xs: 600, md: 660 },
                  height: 70,
                  border: `2px solid ${theme.palette.divider}`,
                  borderRadius: '50px',
                  px: 3,
                  backgroundColor: '#fff',
                  boxShadow: '0 0 14.5px 0 rgba(0, 0, 0, 0.25)',
                  position: { xs: 'fixed', md: 'static' },
                  bottom: { xs: 'max(16px, env(safe-area-inset-bottom))', md: 'auto' },
                  left: { xs: 16, md: 'auto' },
                  right: { xs: 16, md: 'auto' },
                  zIndex: { xs: 1100, md: 'auto' },
                  '&:focus-within': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: '0 12px 36px rgba(0,0,0,0.12)'
                  }
                }}
              >
                {/* Left plus icon */}
                <Tooltip title="Add" arrow enterDelay={300} placement="top">
                  <IconButton
                    aria-label="add"
                    size="small"
                    disableRipple
                    disableFocusRipple
                    sx={{ mr: 1, p: 0, '&:hover': { backgroundColor: 'transparent' } }}
                  >
                    <AddRounded sx={{ width: 20, height: 20, color: '#CD2028' }} />
                  </IconButton>
                </Tooltip>

                {/* Input */}
                <TextField
                  ref={searchInputRef}
                  fullWidth
                  variant="standard"
                  placeholder="Ask anything about Korea..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: '16px',
                      '& input::placeholder': {
                        color: '#888888',
                        fontFamily: 'Metropolis',
                        fontWeight: 600,
                        fontStyle: 'Semi Bold',
                        fontSize: '17px',
                        verticalAlign: 'middle',
                      }
                    },
                  }}
                />

                {/* Right-side toggle icons (desktop) */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                  <Tooltip
                    arrow
                    enterDelay={300}
                    placement="top"
                    title={
                      <Box sx={{ maxWidth: 240 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          Community mode
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Ask your questions to the community directly.
                        </Typography>
                      </Box>
                    }
                  >
                    <IconButton
                      size="small"
                      aria-label="group"
                      onClick={() => toggleIcon('group')}
                      sx={{ mx: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#6F95BD' } }}
                    >
                      <GroupOutlined sx={{ width: 20, height: 20, color: searchToggles.group ? '#6F95BD' : undefined }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    arrow
                    enterDelay={300}
                    placement="top"
                    title={
                      <Box sx={{ maxWidth: 240 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          Expert mode
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Get your questions answered by an expert.
                        </Typography>
                      </Box>
                    }
                  >
                    <IconButton
                      size="small"
                      aria-label="badge"
                      onClick={() => toggleIcon('badge')}
                      sx={{ mx: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#6F95BD' } }}
                    >
                      <WorkspacePremiumOutlined sx={{ width: 20, height: 20, color: searchToggles.badge ? '#6F95BD' : undefined }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Language" arrow enterDelay={300} placement="top">
                    <IconButton
                      size="small"
                      aria-label="language"
                      onClick={() => toggleIcon('globe')}
                      sx={{ mx: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#6F95BD' } }}
                    >
                      <LanguageOutlined sx={{ width: 20, height: 20, color: searchToggles.globe ? '#6F95BD' : undefined }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Attach file" arrow enterDelay={300} placement="top">
                    <IconButton
                      size="small"
                      aria-label="attach"
                      onClick={() => toggleIcon('attach')}
                      sx={{ mx: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#6F95BD' } }}
                    >
                      <AttachFileOutlined sx={{ width: 20, height: 20, color: searchToggles.attach ? '#6F95BD' : undefined }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Voice" arrow enterDelay={300} placement="top">
                    <IconButton
                      size="small"
                      aria-label="mic"
                      onClick={() => toggleIcon('mic')}
                      sx={{ ml: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#6F95BD' } }}
                    >
                      <MicOutlined sx={{ width: 20, height: 20, color: searchToggles.mic ? '#6F95BD' : undefined }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Mobile more (three dots) icon */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <Tooltip title="More options" arrow enterDelay={300} placement="top">
                    <IconButton size="small" aria-label="more">
                      <MoreHoriz />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>
          </motion.div>

          {/* Category Icons - desktop: collapsed => first 6 + More; expanded => first 7 icons; remaining left-aligned with More at end */}
          <LayoutGroup>
          <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ layout: { duration: 0.35, ease: 'easeInOut' }, duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          >
      {/* Desktop rows container centered as a group; second row left-aligned; exact 60px gap below */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mb: { xs: 0, md: '60px' } }}>
              <Box component={motion.div} layout sx={{ width: 'fit-content' }}>
                {/* Row 1: first N categories; show More here only when collapsed */}
                <Box component={motion.div} layout sx={{ display: 'flex', gap: '30px', mb: showAllCategories ? 0.5 : 0, justifyContent: 'flex-start' }}>
                  {(showAllCategories ? categoryIcons.slice(0, ROW1_COUNT) : categoryIcons.slice(0, DESKTOP_VISIBLE)).map((category, index) => (
                    <Box
                      key={index}
                      onClick={() => handleCategoryClick(category)}
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#8888881A',
                          transition: 'box-shadow 0.35s, background-color 0.35s',
                          mb: 1,
                          '&:hover': {
                            background: '#FCF4F4',
                            boxShadow: '0 0 5.2px 1px rgba(0, 0, 0, 0.25)',
                          }
                        }}
                      >
                        {category.Icon ? (
                          <category.Icon sx={{ fontSize: 36, color: '#CD2028' }} />
                        ) : (
                          <Box component="img" src={category.icon} alt={category.label} sx={{ width: 36, height: 36 }} />
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#888888', fontSize: '14px', fontWeight: '600' }}>
                        {category.label}
                      </Typography>
                    </Box>
                  ))}
                  {/* More tile shown in row 1 only when collapsed */}
                  {!showAllCategories && (
                    <Box sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
                      <Box
                        onClick={() => setShowAllCategories((v) => !v)}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                          cursor: 'pointer',
                          mb: 1,
                          transition: 'background-color 0.3s, box-shadow 0.3s',
                          '&:hover': { 
                            background: '#FCF4F4',
                            boxShadow: '0 0 5.2px 1px rgba(0, 0, 0, 0.25)',
                          }
                        }}
                      >
                        <MoreHoriz sx={{ color: 'text.secondary' }} />
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Row 2: appears when expanded; left-aligned; includes remaining categories then More at the end */}
                <AnimatePresence mode="popLayout">
                  {showAllCategories && (
                    <motion.div
                      layout
                      style={{ overflow: 'hidden' }}
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ layout: { duration: 0.35, ease: 'easeInOut' }, duration: 0.25 }}
                    >
                      <Box component={motion.div} layout sx={{ display: 'flex', gap: '30px', mt: 1.5, mb: 0, justifyContent: 'flex-start', flexWrap: 'nowrap' }}>
                        {categoryIcons.slice(ROW1_COUNT).map((category, index) => (
                          <Box
                            key={index}
                            onClick={() => handleCategoryClick(category)}
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                          >
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: theme.palette.background.paper,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                                transition: 'box-shadow 0.25s, background-color 0.25s',
                                mb: 1,
                                '&:hover': { 
                                  background: '#FCF4F4',
                                  boxShadow: '0 0 5.2px 1px rgba(0, 0, 0, 0.25)',
                                }
                              }}
                            >
                              {category.Icon ? (
                                <category.Icon sx={{ fontSize: 36, color: '#CD2028' }} />
                              ) : (
                                <Box component="img" src={category.icon} alt={category.label} sx={{ width: 36, height: 36 }} />
                              )}
                            </Box>
                            <Typography variant="caption" sx={{ color: '#888888', fontSize: '11px', fontWeight: 'bold' }}>
                              {category.label}
                            </Typography>
                          </Box>
                        ))}

                        {/* More tile moves to end of row 2 when expanded */}
                        <Box sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
                          <Box
                            onClick={() => setShowAllCategories((v) => !v)}
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: theme.palette.background.paper,
                              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                              cursor: 'pointer',
                              mb: 1,
                              transition: 'background-color 0.3s, box-shadow 0.3s',
                              '&:hover': { 
                                background: '#FCF4F4',
                                boxShadow: '0 0 5.2px 1px rgba(0, 0, 0, 0.25)',
                              }
                            }}
                          >
                            <MoreHoriz sx={{ color: 'text.secondary' }} />
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          </motion.div>

          {/* Carousel and Trending - hidden on mobile per mock; layout animates when tiles expand/collapse */}
          <motion.div layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ layout: { duration: 0.35, ease: 'easeOut' }, duration: 0.8, delay: 0.6 }}>
            <Box sx={{ mb: 2, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', ml: '20px' }}>
                <Box sx={{ width: 444, height: 244 }}>
                  <BuzzCarousel />
                </Box>
                <Box sx={{ width: 260, height: 244 }}>
                  <TrendingSearches />
                </Box>
              </Box>
            </Box>
          </motion.div>
          </LayoutGroup>
        </Container>
        
        {/* Mobile category row (only the shown icons) */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: { xs: 'calc(max(16px, env(safe-area-inset-bottom)) + 76px)', md: 'auto' },
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            gap: 1.5,
            zIndex: 1095,
          }}
        >
          {categoryIcons.slice(0, 4).map((category, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <div
                elevation={2}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                }}
                onClick={() => handleCategoryClick(category)}
              >
                {category.Icon ? (
                  <category.Icon sx={{ fontSize: 26, color: '#CD2028' }} />
                ) : (
                  <Box component="img" src={category.icon} alt={category.label} sx={{ width: 26, height: 26 }} />
                )}
              </div>
              <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                {category.label}
              </Typography>
            </Box>
          ))}
          {/* More tile */}
          <Box sx={{ textAlign: 'center' }}>
            <Paper
              elevation={2}
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
              }}
              onClick={() => setShowAllCategories((v) => !v)}
            >
              <MoreHoriz sx={{ color: 'text.secondary' }} />
            </Paper>
          </Box>
        </Box>

        {/* Extra categories row when expanded (mobile only) */}
        {showAllCategories && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: { xs: 'calc(max(16px, env(safe-area-inset-bottom)) + 76px + 72px)', md: 'auto' },
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'center',
              gap: 1.5,
              zIndex: 1095,
            }}
          >
            {categoryIcons.slice(4).map((category, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Paper
                  elevation={2}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.Icon ? (
                    <category.Icon sx={{ fontSize: 26, color: '#CD2028' }} />
                  ) : (
                    <Box component="img" src={category.icon} alt={category.label} sx={{ width: 26, height: 26 }} />
                  )}
                </Paper>
                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                  {category.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        
        {/* Floating Footer */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Footer floating={!showAllCategories} />
        </Box>

        {/* Floating Feedback Button - hidden on mobile */}
        <Box sx={{
          position: 'absolute',
          right: 60,
          bottom: 50,
          zIndex: 20,
          display: { xs: 'none', md: 'block' }
        }}>
          <IconButton color="primary" size="large" sx={{
            backgroundColor: theme.palette.background.paper,
            color: '#888888',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            '&:hover': { backgroundColor: 'action.hover' }
          }}>
            <FeedbackOutlined />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

export default Home;
