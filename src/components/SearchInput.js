import AddIcon from '@mui/icons-material/Add';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import MicOutlined from '@mui/icons-material/MicOutlined';
import MoreVert from '@mui/icons-material/MoreVert';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const SearchInput = ({
  searchValue,
  onSearchChange,
  onSearchFocus,
  onSearchSubmit,
  uploadedFiles,
  onFileChange,
  onRemoveFile,
  activeMode,
  onToggleMode,
  isListening,
  getPlaceholderText,
  getSearchBarStyling,
  showMobileSearchActions,
  setShowMobileSearchActions
}) => {
  const theme = useTheme();
  const searchInputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Get current language for display
  const { selectedLanguage, speechLanguageCode } = useLanguage();
  
  // Memoize computed values to prevent re-render loops
  const placeholderText = useMemo(() => getPlaceholderText(), [getPlaceholderText]);
  const searchBarStyling = useMemo(() => getSearchBarStyling(), [getSearchBarStyling]);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 0, md: '25px' } }}>
        <Paper
          data-search-container
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
            ...searchBarStyling
          }}
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={onFileChange}
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          />
          
          {/* Uploaded files section */}
          {uploadedFiles.length > 0 && (
            <Box sx={{ 
              mb: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1
            }}>
              {uploadedFiles.map((file) => (
                <Box
                  key={file.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    backgroundColor: '#f7ededff',
                    borderRadius: 3,
                    fontSize: '14px',
                    flexShrink: 0
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
                      maxWidth: '180px',
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
                    onClick={() => onRemoveFile(file.id)}
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
            {/* Left-side icons: Plus icon for file upload */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Tooltip title="Add photos & files" placement="top" arrow>
                <IconButton
                  size="small"
                  aria-label="add-files"
                  onClick={handleFileUpload}
                  sx={{ color: '#000', '&:hover': { backgroundColor: 'transparent' } }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* Search Input Field */}
            <TextField
              ref={searchInputRef}
              fullWidth
              variant="standard"
              placeholder={placeholderText}
              value={searchValue}
              onChange={onSearchChange}
              onFocus={onSearchFocus}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (searchValue.trim()) {
                    onSearchSubmit(searchValue);
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
                  onClick={() => onToggleMode('community')}
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
                  onClick={() => onToggleMode('expert')}
                  sx={{ mx: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#8A2BE2' } }}
                >
                  <WorkspacePremiumOutlined sx={{ width: 20, height: 20, color: activeMode === 'expert' ? '#8A2BE2' : undefined }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Translate" arrow enterDelay={300} placement="top">
                <IconButton
                  size="small"
                  aria-label="language"
                  onClick={() => onToggleMode('translate')}
                  sx={{ mx: 0.5, color: theme.palette.text.secondary, '&:hover': { backgroundColor: 'transparent' }, '&:hover svg': { color: '#20B2AA' } }}
                >
                  <LanguageOutlined sx={{ width: 20, height: 20, color: activeMode === 'translate' ? '#20B2AA' : undefined }} />
                </IconButton>
              </Tooltip>
              <Tooltip 
                title={
                  <Box>
                    <Typography variant="body2" component="div">
                      {isListening ? "Listening... Click to stop" : "Voice"}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '11px' }}>
                      Language: {selectedLanguage.split(' ')[0]} ({speechLanguageCode})
                    </Typography>
                  </Box>
                } 
                arrow 
                enterDelay={300} 
                placement="top"
              >
                <IconButton
                  size="small"
                  aria-label="mic"
                  onClick={() => onToggleMode('voice')}
                  sx={{ 
                    ml: 0.5, 
                    color: theme.palette.text.secondary, 
                    '&:hover': { backgroundColor: 'transparent' }, 
                    '&:hover svg': { color: '#32CD32' },
                    '&:focus': { outline: 'none' },
                    outline: 'none',
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

      {/* Mobile vertical actions menu (appears above the fixed search bar) */}
      {showMobileSearchActions && (
        <>
          {/* backdrop to close on outside click */}
          <Box onClick={() => setShowMobileSearchActions(false)} sx={{ position: 'fixed', inset: 0, zIndex: 1105, display: { xs: 'block', md: 'none' } }} />
          <Box
            data-mobile-actions
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
            <IconButton size="small" aria-label="group" onClick={() => onToggleMode('community')} sx={{ color: activeMode === 'community' ? '#FF8C00' : 'text.secondary' }}>
              <GroupOutlined />
            </IconButton>
            <IconButton size="small" aria-label="badge" onClick={() => onToggleMode('expert')} sx={{ color: activeMode === 'expert' ? '#8A2BE2' : 'text.secondary' }}>
              <WorkspacePremiumOutlined />
            </IconButton>
            <IconButton size="small" aria-label="language" onClick={() => onToggleMode('translate')} sx={{ color: activeMode === 'translate' ? '#20B2AA' : 'text.secondary' }}>
              <LanguageOutlined />
            </IconButton>
            <IconButton size="small" aria-label="attach" onClick={() => fileInputRef.current?.click()} sx={{ color: 'text.secondary' }}>
              <AttachFileOutlined />
            </IconButton>
            <IconButton 
              size="small" 
              aria-label="mic" 
              onClick={() => onToggleMode('voice')} 
              sx={{ 
                color: activeMode === 'voice' ? '#32CD32' : 'text.secondary',
                '&:focus': { outline: 'none' },
                outline: 'none',
                animation: isListening ? 'voice-pulse 1s ease-in-out infinite' : 'none'
              }}
            >
              <MicOutlined />
            </IconButton>
          </Box>
        </>
      )}
    </motion.div>
  );
};

export default SearchInput;