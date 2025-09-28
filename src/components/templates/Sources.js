import { Box, Button, Typography } from '@mui/material';

const Sources = ({ sources, onSourcesClick }) => {
  if (!sources || sources.length === 0) return null;

  // Extract unique domains and get their favicons (max 3)
  const getUniqueFavicons = () => {
    const uniqueDomains = new Set();
    const favicons = [];
    
    sources.forEach(source => {
      if (source.link && favicons.length < 3) {
        try {
          const url = new URL(source.link);
          const domain = url.hostname;
          if (!uniqueDomains.has(domain)) {
            uniqueDomains.add(domain);
            favicons.push({
              domain,
              faviconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
            });
          }
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });
    
    return favicons;
  };

  const favicons = getUniqueFavicons();

  return (
    <Button
      variant="outlined"
      onClick={onSourcesClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 0.8,
        borderRadius: '50px',
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        color: '#333',
        textTransform: 'none',
        minWidth: 'auto',
        height: 32,
        '&:hover': {
          borderColor: '#3289C9',
          backgroundColor: '#f0f7ff'
        }
      }}
    >
      {/* Display favicons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {favicons.map((favicon, index) => (
          <Box
            key={favicon.domain}
            component="img"
            src={favicon.faviconUrl}
            alt={`${favicon.domain} favicon`}
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.5,
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              objectFit: 'contain'
            }}
            onError={(e) => {
              // Fallback to a generic icon if favicon fails to load
              e.target.style.display = 'none';
            }}
          />
        ))}
        {/* If we have more than 3 sources, show a "+N" indicator */}
        {sources.length > 3 && (
          <Box sx={{
            width: 16,
            height: 16,
            borderRadius: 0.5,
            backgroundColor: '#f0f0f0',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="caption" sx={{ 
              fontSize: '10px', 
              fontWeight: 600, 
              color: '#666',
              lineHeight: 1
            }}>
              +{sources.length}
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
        Sources ({sources.length})
      </Typography>
    </Button>
  );
};

export default Sources;