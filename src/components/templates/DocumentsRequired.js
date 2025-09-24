import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Description } from '@mui/icons-material';

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
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#fff8e1', borderRadius: 2, border: '1px solid #ffcc02' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Description sx={{ color: '#ff8f00', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#ff8f00' }}>
          Required Documents
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Object.entries(documentsRequired).map(([key, value]) => {
          // Skip empty, null, undefined, or N/A values
          if (!value || value === 'N/A' || (typeof value === 'string' && value.trim() === '')) {
            return null;
          }
          
          return (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={formatDocumentName(key)}
              size="small"
              sx={{ 
                backgroundColor: '#fff3e0', 
                color: '#e65100',
                fontWeight: 500,
                minWidth: 120
              }}
            />
            <Typography variant="body2" sx={{ color: '#333' }}>
              {value}
            </Typography>
          </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default DocumentsRequired;