import { Description } from '@mui/icons-material';
import { Box, Chip } from '@mui/material';

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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.entries(documentsRequired).map(([key, value]) => {
          // Skip empty, null, undefined, or N/A values
          if (!value || value === 'N/A' || (typeof value === 'string' && value.trim() === '')) {
            return null;
          }
          
          return (
            <Chip
              key={key}
              icon={<Description sx={{ fontSize: 16 }} />}
              label={`${formatDocumentName(key)}: ${value}`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: '#e0e0e0',
                '& .MuiChip-icon': { color: '#666' }
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default DocumentsRequired;