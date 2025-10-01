import { Email, Language, Phone } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const ContactTemplate = ({ contactInfo, guidanceLink }) => {
  if (!contactInfo && !guidanceLink) return null;

  return (
    <Box sx={{ mt: 1, p: 0 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {contactInfo && (
          <>
            {contactInfo.phone && contactInfo.phone !== 'N/A' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Phone sx={{ fontSize: 16, color: '#4caf50', display: 'flex', alignItems: 'center' }} />
                <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                  {contactInfo.phone}
                </Typography>
              </Box>
            )}
            {contactInfo.email && contactInfo.email !== 'N/A' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Email sx={{ fontSize: 16, color: '#2196f3', display: 'flex', alignItems: 'center' }} />
                <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                  {contactInfo.email}
                </Typography>
              </Box>
            )}
            {contactInfo.website && contactInfo.website !== 'N/A' && (
              <Box 
                component="a"
                href={contactInfo.website}
                target="_blank"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  textDecoration: 'none',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Language sx={{ fontSize: 16, color: '#ff9800', display: 'flex', alignItems: 'center' }} />
                <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                  Website
                </Typography>
              </Box>
            )}
          </>
        )}            
        {/* Guidance Link */}
        {guidanceLink && guidanceLink !== 'N/A' && (
          <Box 
            component="a"
            href={guidanceLink}
            target="_blank"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              textDecoration: 'none',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <Language sx={{ fontSize: 16, color: '#f44336', display: 'flex', alignItems: 'center' }} />
            <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
              Visitor Guide
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContactTemplate;