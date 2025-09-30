import { Facebook, Instagram, LinkedIn, Twitter, YouTube } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const SocialInfoTemplate = ({ socialMedia }) => {

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
    <Box sx={{ mt: 3, p: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(socialMedia).map(([platform, url]) => {
          // Skip empty, null, undefined, N/A, or whitespace-only values
          if (!url || url === 'N/A' || (typeof url === 'string' && url.trim() === '')) {
            return null;
          }
          
          return (
            <Box key={platform} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getSocialIcon(platform)}
              </Box>
              <Typography
                variant="body2"
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#555',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {formatPlatformName(platform)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SocialInfoTemplate;