import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Facebook, Instagram, YouTube, Twitter, LinkedIn } from '@mui/icons-material';

const SocialInfoTemplate = ({ socialMedia }) => {
  const theme = useTheme();

  // Don't render if no data or if it's just a string 'N/A'
  if (!socialMedia || socialMedia === 'N/A' || typeof socialMedia === 'string') {
    return null;
  }
  
  // Don't render if it's an empty object
  if (Object.keys(socialMedia).length === 0) {
    return null;
  }
  
  // Don't render if ALL values are N/A or empty
  const hasValidLinks = Object.values(socialMedia).some(link => link && link !== 'N/A' && link.trim() !== '');
  if (!hasValidLinks) {
    return null;
  }

  const getSocialIcon = (platform) => {
    const iconMap = {
      facebook: <Facebook sx={{ fontSize: 16 }} />,
      instagram: <Instagram sx={{ fontSize: 16 }} />,
      youtube: <YouTube sx={{ fontSize: 16 }} />,
      twitter: <Twitter sx={{ fontSize: 16 }} />,
      linkedin: <LinkedIn sx={{ fontSize: 16 }} />,
      tiktok: '🎵' // Use emoji for TikTok since MUI doesn't have the icon
    };
    return iconMap[platform] || null;
  };

  const formatPlatformName = (platform) => {
    const nameMap = {
      facebook: 'Facebook',
      instagram: 'Instagram', 
      youtube: 'YouTube',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok'
    };
    return nameMap[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <Box sx={{ mt: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
        📱 Social Media
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Object.entries(socialMedia).map(([platform, url]) => {
          // Skip empty, null, undefined, N/A, or whitespace-only values
          if (!url || url === 'N/A' || (typeof url === 'string' && url.trim() === '')) {
            return null;
          }
          
          return (
            <Button
              key={platform}
              variant="outlined"
              size="small"
              startIcon={getSocialIcon(platform)}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                justifyContent: 'flex-start',
                width: 'fit-content',
                borderColor: '#e0e0e0',
                color: '#666',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '08',
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              {formatPlatformName(platform)}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default SocialInfoTemplate;