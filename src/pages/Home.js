// Add outlined icons for search bar toggles
import AddIcon from '@mui/icons-material/Add';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import FeedbackOutlined from '@mui/icons-material/FeedbackOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MicOutlined from '@mui/icons-material/MicOutlined';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import MoreVert from '@mui/icons-material/MoreVert';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BuzzCarousel from '../components/BuzzCarousel';
import CommunityPostDialog from '../components/CommunityPostDialog';
import FeedbackPopup from '../components/FeedbackPopup';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import TrendingSearches from '../components/TrendingSearches';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { questionsAPI } from '../services/api';
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
  const searchInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Right-side icons in the search bar: only one can be active at a time
  const [activeMode, setActiveMode] = useState(null); // 'community', 'expert', 'translate', 'voice', or null

  // Dropdown menu state for plus sign
  const [plusMenuAnchor, setPlusMenuAnchor] = useState(null);
  const handlePlusMenuOpen = (event) => {
    setPlusMenuAnchor(event.currentTarget);
  };
  const handlePlusMenuClose = () => {
    setPlusMenuAnchor(null);
  };
  // Mobile: toggle vertical actions menu from the three dots
  const [showMobileSearchActions, setShowMobileSearchActions] = useState(false);
  
  // Speech recognition using custom hook
  const {
    isListening,
    isSupported: speechSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition({
    pauseTimeout: 3000,
    language: 'en-US'
  });

  // Update search value when transcript changes
  useEffect(() => {
    if (transcript) {
      setSearchValue(prev => prev + transcript);
      resetTranscript(); // Clear the transcript after adding to search value
    }
  }, [transcript, resetTranscript]);

  // Auto-untoggle voice mode when speech recognition stops (e.g., after 3-second pause)
  // Add a small delay to prevent interference with user clicks
  useEffect(() => {
    if (activeMode === 'voice' && !isListening) {
      const timeoutId = setTimeout(() => {
        // Double-check the state after delay to ensure it wasn't a temporary transition
        if (activeMode === 'voice' && !isListening) {
          setActiveMode(null);
        }
      }, 100); // Small delay to allow speech recognition to start
      
      return () => clearTimeout(timeoutId);
    }
  }, [isListening, activeMode]);
  
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
  const getPlaceholderText = () => {
    switch (activeMode) {
      case 'community':
        return 'Ask your questions directly to the Foreign Community';
      case 'expert':
        return 'Ask our certified experts directly. Conversations remain private.';
      case 'translate':
        return 'Ask anything about Korea';
      case 'voice':
        return isListening ? 'Listening... (will stop after 3 seconds of silence)' : 'Click the microphone to start speaking or type your question...';
      default:
        return 'Ask anything about Korea';
    }
  };

  // Get search bar styling based on active mode
  const getSearchBarStyling = () => {
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
  };
  // Mobile: show more categories when tapping the three dots
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  // Password gating removed for standard search
  const [expertPosting, setExpertPosting] = useState(false);
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

  const goSearch = (query) => {
    if (!query.trim()) return;
    const isExpert = localStorage.getItem('expertMode') === '1';
    if (isExpert) {
      // Redirect to library with expert tab flag
      navigate('/library?tab=expert');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const requestProtectedSearch = (query) => {
    // Expert mode still posts then redirects; standard search navigates directly (no password)
    if (localStorage.getItem('expertMode') === '1') {
      const trimmed = (query || '').trim();
      if (!trimmed) return;
      if (expertPosting) return;
      setExpertPosting(true);
      try {
        const asked_by = user?.email || 'anonymous';
        questionsAPI
          .ask({ question_text: trimmed, asked_by })
          .catch(() => {})
          .finally(() => {
            setExpertPosting(false);
            goSearch(trimmed);
          });
      } catch (e) {
        setExpertPosting(false);
        goSearch(trimmed);
      }
      return;
    }
    goSearch(query);
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

  const handleFileUpload = () => {
    fileInputRef.current?.click();
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
        ml: { xs: 0, md: '66px' }
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
          mb: { xs: 0, md: '60px' },
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
          
          {/* Desktop: top-right auth buttons */}
          {!isAuthenticated ? (
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
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0, delay: 0.1 }}>
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
                  onClick={() => navigate('/profile')}
                  sx={{
                    borderRadius: '25px',
                    px: 2.5,
                    height: '45px',
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
                  Profile
                </Button>
              </Box>
            </motion.div>
          )}
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ flex: 1, px: 2, pt: 1, pb: { xs: 0, md: showAllCategories ? 2 : 8.5 } }}>
          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 0, md: '25px' } }}>
              <Paper
                elevation={6}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: { xs: '90%', md: '660px' },
                  maxWidth: { xs: 600, md: 660 },
                  minHeight: uploadedFiles.length > 0 ? 'auto' : 70,
                  border: `2px solid ${theme.palette.divider}`,
                  borderRadius: uploadedFiles.length > 0 ? '24px' : '50px',
                  p: uploadedFiles.length > 0 ? 2 : 0,
                  px: uploadedFiles.length > 0 ? 2 : 3,
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
                  },
                  ...getSearchBarStyling()
                }}
              >
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />
                
                {/* Uploaded files section */}
                {uploadedFiles.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {uploadedFiles.map((file) => (
                      <Box
                        key={file.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                          p: 1,
                          backgroundColor: '#f7ededff',
                          borderRadius: 3,
                          fontSize: '14px'
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: '#CD2028',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', fontSize: '10px' }}>
                            {file.type.includes('pdf') ? 'PDF' : file.name.split('.').pop()?.toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography 
                          sx={{ 
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '14px', 
                            color: '#333' 
                          }}
                          title={file.name}
                        >
                          {file.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeFile(file.id)}
                          sx={{ color: '#666', p: 0.5 }}
                        >
                          ×
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Main input and controls section */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  minHeight: uploadedFiles.length > 0 ? 50 : 70,
                  py: uploadedFiles.length > 0 ? 1 : 0
                }}>
                  {/* Left-side icons: Plus dropdown menu */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <Tooltip title="Add or Assist" placement="top" arrow>
                      <IconButton
                        size="small"
                        aria-label="add-menu"
                        onClick={handlePlusMenuOpen}
                        sx={{ color: '#000', '&:hover': { backgroundColor: 'transparent' } }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={plusMenuAnchor}
                      open={Boolean(plusMenuAnchor)}
                      onClose={handlePlusMenuClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      PaperProps={{
                        sx: {
                          borderRadius: 3.5,
                          minWidth: 270,
                          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                          p: 0.5,
                          mt: 1,
                        }
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handlePlusMenuClose();
                          handleFileUpload();
                        }}
                        sx={{
                          alignItems: 'center',
                          py: 1,
                          borderRadius: 2,
                          mx: 0.5,
                          mt: 0.3,
                          mb: 0.6,
                          backgroundColor: '#f5f5f5',
                          gap: 1,
                          '&:hover': { backgroundColor: '#ededed' }
                        }}
                      >
                        <AttachFileOutlined sx={{ color: '#000', width: 20, height: 20 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#222' }}>Add photos & files</Typography>
                      </MenuItem>
                      <Divider sx={{ my: 0.4, mx: 0.5 }} />
                      <Tooltip
                        arrow
                        placement="right"
                        title={
                          <Box sx={{ maxWidth: 230 }}>
                            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.25 }}>
                              Attach any application form and we will help you fill it out
                            </Typography>
                          </Box>
                        }
                      >
                        <MenuItem
                          onClick={() => {
                            handlePlusMenuClose();
                            // Could add assist mode functionality here if needed
                          }}
                          sx={{ alignItems: 'center', py: 1, borderRadius: 3, mx: 0.5, gap: 1 }}
                        >
                          <MenuBookIcon sx={{ color: '#000', width: 20, height: 20 }} />
                          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#222' }}>Assist mode</Typography>
                        </MenuItem>
                      </Tooltip>
                    </Menu>
                  </Box>
                  
                {/* Removed left plus icon previously triggering CommunityPostDialog */}
                {/* Input */}
                <TextField
                  ref={searchInputRef}
                  fullWidth
                  variant="standard"
                  placeholder={getPlaceholderText()}
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (searchValue.trim()) {
                        requestProtectedSearch(searchValue);
                      }
                    }
                  }}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: { xs: '14px', md: '16px' },
                      '& input::placeholder': {
                        color: '#888888',
                        fontFamily: 'Metropolis',
                        fontWeight: 500,
                        fontStyle: 'Semi Bold',
                        fontSize: { xs: '12px', md: '13px' },
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
                      onClick={() => toggleMode('community')}
                      sx={{ mx: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#FF8C00' } }}
                    >
                      <GroupOutlined sx={{ width: 20, height: 20, color: activeMode === 'community' ? '#FF8C00' : undefined }} />
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
                      onClick={() => {
                        toggleMode('expert');
                        if (activeMode !== 'expert') {
                          localStorage.setItem('expertMode', '1');
                        } else {
                          localStorage.removeItem('expertMode');
                        }
                      }}
                      sx={{ mx: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#8A2BE2' } }}
                    >
                      <WorkspacePremiumOutlined sx={{ width: 20, height: 20, color: activeMode === 'expert' ? '#8A2BE2' : undefined }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Translate" arrow enterDelay={300} placement="top">
                    <IconButton
                      size="small"
                      aria-label="language"
                      onClick={() => toggleMode('translate')}
                      sx={{ mx: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#20B2AA' } }}
                    >
                      <LanguageOutlined sx={{ width: 20, height: 20, color: activeMode === 'translate' ? '#20B2AA' : undefined }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={isListening ? "Listening... Click to stop" : "Voice"} arrow enterDelay={300} placement="top">
                    <IconButton
                      size="small"
                      aria-label="mic"
                      onClick={() => toggleMode('voice')}
                      sx={{ 
                        ml: 0.5, 
                        color: theme.palette.text.secondary, 
                        '&:hover': { backgroundColor: 'transparent' }, 
                        '&:hover svg': { color: '#32CD32' },
                        animation: isListening ? 'voice-pulse 1s ease-in-out infinite' : 'none'
                      }}
                    >
                      <MicOutlined sx={{ 
                        width: 20, 
                        height: 20, 
                        color: activeMode === 'voice' ? '#32CD32' : undefined,
                        opacity: isListening ? 1 : (activeMode === 'voice' ? 1 : undefined)
                      }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Mobile more (three dots) icon */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <Tooltip title="More options" arrow enterDelay={300} placement="top">
                    <IconButton size="small" aria-label="more" onClick={() => setShowMobileSearchActions((v) => !v)}>
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </Box>
                </Box>
              </Paper>
            </Box>
          </motion.div>

          {/* Mobile vertical actions menu (appears above the fixed search bar) */}
          {showMobileSearchActions && (
            <>
              {/* backdrop to close on outside click */}
              <Box onClick={() => setShowMobileSearchActions(false)} sx={{ position: 'fixed', inset: 0, zIndex: 1105, display: { xs: 'block', md: 'none' } }} />
              <Box
                sx={{
                  position: 'fixed',
                  right: 22,
                  bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 92px)',
                  zIndex: 1110,
                  bgcolor: '#fff',
                  borderRadius: '28px',
                  p: 1.2,
                  boxShadow: '0 10px 22px rgba(0,0,0,0.20)',
                  display: { xs: 'flex', md: 'none' },
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.2,
                }}
              >
                <IconButton size="small" aria-label="group" onClick={() => toggleMode('community')} sx={{ color: activeMode === 'community' ? '#FF8C00' : 'text.secondary' }}>
                  <GroupOutlined />
                </IconButton>
                <IconButton size="small" aria-label="badge" onClick={() => toggleMode('expert')} sx={{ color: activeMode === 'expert' ? '#8A2BE2' : 'text.secondary' }}>
                  <WorkspacePremiumOutlined />
                </IconButton>
                <IconButton size="small" aria-label="language" onClick={() => toggleMode('translate')} sx={{ color: activeMode === 'translate' ? '#20B2AA' : 'text.secondary' }}>
                  <LanguageOutlined />
                </IconButton>
                <IconButton size="small" aria-label="attach" onClick={() => fileInputRef.current?.click()} sx={{ color: 'text.secondary' }}>
                  <AttachFileOutlined />
                </IconButton>
                <IconButton 
                  size="small" 
                  aria-label="mic" 
                  onClick={() => toggleMode('voice')} 
                  sx={{ 
                    color: activeMode === 'voice' ? '#32CD32' : 'text.secondary',
                    animation: isListening ? 'voice-pulse 1s ease-in-out infinite' : 'none'
                  }}
                >
                  <MicOutlined />
                </IconButton>
              </Box>
            </>
          )}

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
                      <Typography variant="caption" sx={{ color: '#888888', fontSize: '12px', fontWeight: '600' }}>
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
                            <Typography variant="caption" sx={{ color: '#888888', fontSize: '12px', fontWeight: 'bold' }}>
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
              <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '12px', lineHeight: 1.2 }}>
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
                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '12px', lineHeight: 1.2 }}>
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
