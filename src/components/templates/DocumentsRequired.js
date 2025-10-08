import { Description } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const DocumentsRequired = ({ documentsRequired }) => {
  // Don't render if no data or if it's just a string 'N/A'
  if (!documentsRequired || documentsRequired === 'N/A' || typeof documentsRequired === 'string') {
    return null;
  }
  
  // Don't render if it's an empty object
  if (Object.keys(documentsRequired).length === 0) {
    return null;
  }
  
  // Don't render if ALL values are N/A or empty
  const hasValidFields = Object.values(documentsRequired).some(val => val && val !== 'N/A' && val.trim() !== '');
  if (!hasValidFields) {
    return null;
  }

  const formatDocumentName = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Box sx={{ mt: 2, p: 0 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {Object.entries(documentsRequired).map(([key, value]) => {
          // Skip empty, null, undefined, or N/A values
          if (!value || value === 'N/A' || (typeof value === 'string' && value.trim() === '')) {
            return null;
          }
          
          return (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ color: '#666', fontSize: 16, display: 'flex', alignItems: 'center' }}>
                <Description sx={{ fontSize: 16 }} />
              </Box>
              <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                {formatDocumentName(key)}: {value}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default DocumentsRequired;