// Add outlined icons for search bar toggles
import FeedbackOutlined from '@mui/icons-material/FeedbackOutlined';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import BuzzCarousel from '../components/BuzzCarousel';
import CommunityPostDialog from '../components/CommunityPostDialog';
import FeedbackPopup from '../components/FeedbackPopup';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import SearchInput from '../components/SearchInput';
import TrendingSearches from '../components/TrendingSearches';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { selectUser } from '../store';

const imgBase = process.env.PUBLIC_URL;
const categoryIcons = [
  { icon: `${imgBase}/images/home/1.Chungju.svg`, label: 'Chungju', color: '#8888881A', url: 'https://www.chungju.go.kr/english/index.do' },
  { icon: `${imgBase}/images/home/2.Seoul.png`, label: 'Seoul', color: '#8888881A', url: 'https://english.seoul.go.kr' },
  { icon: `${imgBase}/images/home/3.%20Busan.png`, label: 'Busan', color: '#8888881A', url: 'https://english.busan.go.kr' },
  { icon: `${imgBase}/images/home/4.Daegu.png`, label: 'Daegu', color: '#8888881A', url: 'https://daegu.go.kr/english/index.do' },
  { icon: `${imgBase}/images/home/6.%20Gwangju.png`, label: 'Gwangju', color: '#8888881A', url: 'https://gwangju.go.kr/eng/' },
  { icon: `${imgBase}/images/home/7.%20Daejeon.png`, label: 'Daejeon', color: '#8888881A', url: 'https://www.daejeon.go.kr/english/index.do' },
  { icon: `${imgBase}/images/home/8.%20Ulsan.png`, label: 'Ulsan', color: '#8888881A', url: 'https://www.ulsan.go.kr/u/english/main.ulsan' },
  { icon: `${imgBase}/images/home/9.%20Sejong.png`, label: 'Sejong', color: '#8888881A', url: 'https://www.sejong.go.kr/eng.do' },
  { icon: `${imgBase}/images/home/10.%20Gyeonggi.svg`, label: 'Gyeonggi', color: '#8888881A', url: 'https://english.gg.go.kr' },
  { icon: `${imgBase}/images/home/11.%20gangwon.png`, label: 'Gangwon', color: '#8888881A', url: 'https://state.gwd.go.kr/portal' },
  { icon: `${imgBase}/images/home/14.%20North_Jeolla.svg`, label: 'N. Jeolla', color: '#8888881A', url: 'https://www.jeonbuk.go.kr/eng/index.jeonbuk' },
  { icon: `${imgBase}/images/home/15.%20South_Jeolla.svg`, label: 'S. Jeolla', color: '#8888881A', url: 'https://www.jeonbuk.go.kr/eng/index.jeonbuk' },
  { icon: `${imgBase}/images/home/18.%20Jeju.png`, label: 'Jeju', color: '#8888881A', url: 'https://www.jeju.go.kr' },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const user = useSelector(selectUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Get language context for speech recognition
  const { speechLanguageCode } = useLanguage();
  
  // Search limit for non-authenticated users
  const [searchCount, setSearchCount] = useState(() => {
    const stored = localStorage.getItem('guestSearchCount');
    return stored ? parseInt(stored, 10) : 0;
  });
  const MAX_GUEST_SEARCHES = 3;

  // Helper function to get remaining searches for display
  const getRemainingSearches = () => Math.max(0, MAX_GUEST_SEARCHES - searchCount);
  const hasExceededLimit = () => searchCount >= MAX_GUEST_SEARCHES;

  // Right-side icons in the search bar: only one can be active at a time
  const [activeMode, setActiveMode] = useState(null); // 'community', 'expert', 'translate', 'voice', or null
  const activeModeRef = useRef(null);
  
  // Update ref whenever activeMode changes
  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);
  
  // Mobile: toggle vertical actions menu from the three dots
  const [showMobileSearchActions, setShowMobileSearchActions] = useState(false);
  
  // Speech recognition using custom hook
  
  // Define navigation function first
  const requestProtectedSearch = useCallback((query) => {
    console.log('requestProtectedSearch called with query:', query);
    if (!query || !query.trim()) {
      console.log('Empty query, returning early');
      return;
    }
    
    // Check if user is authenticated
    if (!user) {
      // For non-authenticated users, check search limit
      if (searchCount >= MAX_GUEST_SEARCHES) {
        console.log('Guest user has exceeded search limit, redirecting to signup');
        navigate('/signup');
        return;
      }
      
      // Increment search count for guest users
      const newCount = searchCount + 1;
      setSearchCount(newCount);
      localStorage.setItem('guestSearchCount', newCount.toString());
      console.log(`Guest search ${newCount}/${MAX_GUEST_SEARCHES}`);
    }
    
    // Always navigate to search results page
    console.log('Navigating to search results with query:', query.trim());
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }, [navigate, user, searchCount, MAX_GUEST_SEARCHES]);

  // Get speech recognition functions
  const {
    isListening,
    isSupported: speechSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    error: speechError,
    changeLanguage,
    currentLanguage
  } = useSpeechRecognition({
    language: speechLanguageCode
    // No onTranscriptComplete callback since we don't auto-submit
  });
  
  // Reset search count when user logs in
  useEffect(() => {
    if (user) {
      setSearchCount(0);
      localStorage.removeItem('guestSearchCount');
    }
  }, [user]);
  
  // Update speech recognition language when global language changes
  useEffect(() => {
    if (changeLanguage && speechLanguageCode !== currentLanguage) {
      console.log(`🌍 Updating speech recognition language from ${currentLanguage} to ${speechLanguageCode}`);
      changeLanguage(speechLanguageCode);
    }
  }, [speechLanguageCode, currentLanguage, changeLanguage]);
  
  // Add click outside handler to deactivate modes
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the search input area and mode icons
      const searchContainer = document.querySelector('[data-search-container]');
      const mobileActionsContainer = document.querySelector('[data-mobile-actions]');
      
      if (searchContainer && !searchContainer.contains(event.target) && 
          (!mobileActionsContainer || !mobileActionsContainer.contains(event.target))) {
        // Deactivate any active mode
        if (activeMode) {
          if (activeMode === 'voice') {
            stopListening();
          }
          setActiveMode(null);
          setShowMobileSearchActions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMode, stopListening]);

  // Update search value with transcript in real-time
  useEffect(() => {
    if (transcript) {
      setSearchValue(transcript);
    }
  }, [transcript]);

  // Show interim results in real-time for better user feedback
  const displaySearchValue = useMemo(() => {
    if (activeMode === 'voice' && interimTranscript) {
      return searchValue + interimTranscript;
    }
    return searchValue;
  }, [searchValue, interimTranscript, activeMode]);

  // Auto-untoggle voice mode when speech recognition stops (unless auto-submitting)
  useEffect(() => {
    if (activeModeRef.current === 'voice' && !isListening) {
      // Only untoggle if we're still in voice mode and not listening
      // (auto-submit will handle mode change immediately)
      if (activeModeRef.current === 'voice' && !isListening) {
        setActiveMode(null);
      }
    }
  }, [isListening]); // Remove activeMode dependency to prevent infinite loop
  
  // Toggle function that ensures only one mode is active at a time
  const toggleMode = (mode) => {
    // Handle voice mode speech recognition
    if (mode === 'voice') {
      if (activeMode === 'voice') {
        // Stopping voice mode
        stopListening();
        setActiveMode(null);
      } else {
        // Starting voice mode - set mode first, then start listening
        setActiveMode('voice');
        if (speechSupported) {
          const success = startListening();
          if (!success) {
            // If starting failed, revert the mode
            setActiveMode(null);
            // Show error message if available
            if (speechError) {
              alert(speechError.message);
            } else {
              alert('Failed to start speech recognition. Please check your microphone permissions.');
            }
            return;
          }
        } else {
          // If not supported, revert the mode
          setActiveMode(null);
          alert('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
          return;
        }
      }
    } else {
      // For other modes or switching away from voice mode
      if (activeMode === 'voice') {
        stopListening();
      }
      const newMode = activeMode === mode ? null : mode;
      setActiveMode(newMode);
    }
    
    // Handle expert mode localStorage
    if (mode === 'expert') {
      if (activeMode === 'expert') {
        localStorage.removeItem('expertMode');
      } else {
        localStorage.setItem('expertMode', '1');
      }
    } else if (activeMode === 'expert') {
      localStorage.removeItem('expertMode');
    }
  };

  // Get placeholder text based on active mode
  const getPlaceholderText = useCallback(() => {
    switch (activeMode) {
      case 'community':
        return 'Ask your questions directly to the Foreign Community';
      case 'expert':
        return 'Ask our certified experts directly. Conversations remain private.';
      case 'translate':
        return 'Ask anything about Korea';
      case 'voice':
        return isListening ? 'Listening... (will stop after 2 seconds of silence)' : 'Click the microphone to start speaking or type your question...';
      default:
        return 'Ask anything about Korea';
    }
  }, [activeMode, isListening]);

  // Get search bar styling based on active mode
  const getSearchBarStyling = useCallback(() => {
    const baseStyle = {
      borderColor: theme.palette.divider,
      boxShadow: '0 0 14.5px 0 rgba(0, 0, 0, 0.25)',
    };

    switch (activeMode) {
      case 'community':
        return {
          ...baseStyle,
          borderColor: '#FF8C00',
          boxShadow: '0 0 20px rgba(255, 140, 0, 0.3)',
          '&:focus-within': {
            borderColor: '#FF8C00',
            boxShadow: '0 0 25px rgba(255, 140, 0, 0.4)'
          }
        };
      case 'expert':
        return {
          ...baseStyle,
          borderColor: '#8B5A9F',
          boxShadow: '0 0 20px rgba(139, 90, 159, 0.3)',
          '&:focus-within': {
            borderColor: '#8B5A9F',
            boxShadow: '0 0 25px rgba(139, 90, 159, 0.4)'
          }
        };
      case 'translate':
        return {
          ...baseStyle,
          borderColor: '#40E0D0',
          boxShadow: '0 0 20px rgba(64, 224, 208, 0.3)',
          '&:focus-within': {
            borderColor: '#40E0D0',
            boxShadow: '0 0 25px rgba(64, 224, 208, 0.4)'
          }
        };
      case 'voice':
        return {
          ...baseStyle,
          borderColor: '#32CD32',
          boxShadow: activeMode === 'voice' ? '0 0 20px rgba(50, 205, 50, 0.6)' : '0 0 20px rgba(50, 205, 50, 0.3)',
          animation: activeMode === 'voice' ? 'voice-pulse 1.5s ease-in-out infinite' : 'none',
          '&:focus-within': {
            borderColor: '#32CD32',
            boxShadow: '0 0 25px rgba(50, 205, 50, 0.4)'
          }
        };
      default:
        return {
          ...baseStyle,
          '&:focus-within': {
            borderColor: theme.palette.primary.main,
            boxShadow: '0 12px 36px rgba(0,0,0,0.12)'
          }
        };
    }
  }, [activeMode, theme]);
  // Mobile: show more categories when tapping the three dots
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  // Password gating removed for standard search
  // Desktop: number of category tiles visible before the "More" tile
  const DESKTOP_VISIBLE = 6; // collapsed: 6 + More = 7 tiles in row 1
  const ROW1_COUNT = 7; // expanded: always keep 7 real icons on the top row

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    // Initialize expert mode toggle from persisted flag
    if (localStorage.getItem('expertMode') === '1') {
      setActiveMode('expert');
    }

    // Add voice pulse animation to document head
    const style = document.createElement('style');
    style.textContent = `
      @keyframes voice-pulse {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(50, 205, 50, 0.6), 0 0 40px rgba(50, 205, 50, 0.4), 0 0 60px rgba(50, 205, 50, 0.2);
        }
        50% { 
          box-shadow: 0 0 30px rgba(50, 205, 50, 0.8), 0 0 60px rgba(50, 205, 50, 0.6), 0 0 90px rgba(50, 205, 50, 0.4);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSearchFocus = () => {
    // No-op: do not open dialog from search focus
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Do not open dialog from typing
  };




  const handleCategoryClick = (category) => {
    // If a URL is provided, open it in a new tab. This is public info so no auth gating.
    if (category?.url) {
      window.open(category.url, '_blank', 'noopener,noreferrer');
      return;
    }
    // Fallback: preserve previous behavior (auth gate) if no URL exists (should not happen now).
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    console.log('Category clicked (no url):', category);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    // Reset the input so the same file can be uploaded again if needed
    event.target.value = '';
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <>
      {/* Navigation Component */}
      <Navigation user={user} />
      
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        // Always allow parent to scroll on desktop; keep mobile hidden due to fixed bottom search bar
        overflowY: { xs: 'hidden', md: 'visible' },
        position: 'relative',
        minHeight: '100%',
        // Add left margin on desktop to account for sidebar
        ml: { xs: 0 }
      }}>
        {/* Header with Logo */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 3 },
          position: { xs: 'absolute', md: 'relative' },
          left: { xs: 0, md: 'auto' },
          right: { xs: 0, md: 'auto' },
          top: { xs: '30%', md: 'auto' },
          transform: { xs: 'translateY(-50%)', md: 'none' },
          mb: { xs: 0, md: '30px' },
          mt: { xs: 0, md: '60px' }
        }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Box
                component="img"
                src={`${imgBase}/images/Konnect_logo.png`}
                alt="Konnect"
                sx={{
                  maxHeight: { xs: 60, md: 69 },
                  height: 'auto',
                  width: 'auto',
                  maxWidth: { xs: 260, md: 460 },
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              {/* Tagline for mobile: right aligned */}
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: 'primary.main', 
                  mt: 1, 
                  display: { xs: 'block', md: 'none' }, 
                  fontFamily: 'cursive', 
                  alignSelf: 'flex-end',
                  pr: 1.5,
                  fontSize: { xs: '15px', md: 'inherit' }
                }}
              >
                with Korea
              </Typography>
            </Box>
          </motion.div>
          
          {/* Desktop: top-right auth buttons - only show when not authenticated */}
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
                    height: '36px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: 'Metropolis',
                    fontStyle: 'normal',
                    fontSize: '12px',
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
                    height: '36px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: 'Metropolis',
                    fontStyle: 'normal',
                    fontSize: '12px',
                    border: '1px solid #888888',
                    color: '#888888',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  Log in
                </Button>
              </Box>
            </motion.div>
          )}
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ flex: 1, px: 2, pt: 1, pb: { xs: 0, md: showAllCategories ? 2 : 8.5 } }}>
          {/* Search limit indicator for non-authenticated users */}
          {!user && searchCount > 0 && (
            <Box sx={{ 
              textAlign: 'center', 
              mb: 0.5 
            }}>
              <Typography variant="caption" sx={{ 
                color: hasExceededLimit() || getRemainingSearches() === 1 ? 'error.main' : 'text.secondary',
                fontSize: '12px'
              }}>
                {hasExceededLimit() ? (
                  'Search limit reached. Please sign up to continue searching.'
                ) : (
                  `${getRemainingSearches()} search${getRemainingSearches() === 1 ? '' : 'es'} remaining. Sign up for unlimited searches.`
                )}
              </Typography>
            </Box>
          )}
          
          {/* Search Section */}
          <Box sx={{ mb: 1 }}>
            <SearchInput
              searchValue={displaySearchValue}
              onSearchChange={handleSearchChange}
              onSearchFocus={handleSearchFocus}
              onSearchSubmit={requestProtectedSearch}
              uploadedFiles={uploadedFiles}
              onFileChange={handleFileChange}
              onRemoveFile={removeFile}
              activeMode={activeMode}
              onToggleMode={toggleMode}
              isListening={isListening}
              getPlaceholderText={getPlaceholderText}
              getSearchBarStyling={getSearchBarStyling}
              showMobileSearchActions={showMobileSearchActions}
              setShowMobileSearchActions={setShowMobileSearchActions}
            />
          </Box>

          {/* Category Icons - desktop: collapsed => first 6 + More; expanded => first 7 icons; remaining left-aligned with More at end */}
          <LayoutGroup>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          >
      {/* Desktop rows container centered as a group; second row left-aligned; exact 60px gap below */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mb: { xs: 0, md: '50px' } }}>
              <Box sx={{ width: 'fit-content' }}>
                {/* Row 1: first N categories; show More here only when collapsed */}
                <Box sx={{ display: 'flex', gap: '30px', mb: showAllCategories ? 0.5 : 0, justifyContent: 'flex-start' }}>
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
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                          cursor: 'pointer',
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
                      <Typography variant="caption" sx={{ color: '#888888', fontSize: '13px', fontWeight: '400' }}>
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
                          transition: 'background-color 0.35s, box-shadow 0.35s',
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
                      style={{ overflow: 'hidden' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Box sx={{ display: 'flex', gap: '30px', mt: 1.5, mb: 0, justifyContent: 'flex-start', flexWrap: 'nowrap' }}>
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
                            <Typography variant="caption" sx={{ color: '#888888', fontSize: '13px', fontWeight: '400' }}>
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
                              transition: 'background-color 0.35s, box-shadow 0.35s',
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}>
            <Box sx={{ mb: 2, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', ml: '20px' }}>
                <Box sx={{ width: 444, height: 244 }}>
                  <BuzzCarousel />
                </Box>
                <Box sx={{ width: 260, height: 244 }}>
                  <TrendingSearches onSearchClick={requestProtectedSearch} />
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
            bottom: { xs: 'calc(max(16px, env(safe-area-inset-bottom)) + 100px)', md: 'auto' },
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
              <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '13px', lineHeight: 1.2 }}>
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
              bottom: { xs: 'calc(max(16px, env(safe-area-inset-bottom)) + 112px + 72px)', md: 'auto' },
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
                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '13px', lineHeight: 1.2 }}>
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
          <IconButton onClick={() => setFeedbackOpen(true)} color="primary" size="large" sx={{
            backgroundColor: theme.palette.background.paper,
            color: '#888888',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            '&:hover': { backgroundColor: 'action.hover' }
          }}>
            <FeedbackOutlined />
          </IconButton>
        </Box>

        {/* Feedback Popup */}
        <FeedbackPopup open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

  {/* Community Post Dialog */}
  <CommunityPostDialog open={postOpen} onClose={() => setPostOpen(false)} onSubmit={(payload) => console.log('post payload', payload)} />
      </Box>
    </>
  );
}

export default Home;
