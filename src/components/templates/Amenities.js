import React from 'react';
import { Box, Chip, Typography, useTheme } from '@mui/material';
import { 
  Accessible, 
  DirectionsCar, 
  Wc, 
  ChairAlt,
  WbSunny 
} from '@mui/icons-material';

const Amenities = ({ amenities }) => {
  const theme = useTheme();

  if (!amenities || Object.keys(amenities).length === 0) return null;

  const getAmenityIcon = (key) => {
    const iconMap = {
      toilet: <Wc sx={{ fontSize: 16 }} />,
      parking: <DirectionsCar sx={{ fontSize: 16 }} />,
      outdoor_seating: <WbSunny sx={{ fontSize: 16 }} />,
      indoor_seating: <ChairAlt sx={{ fontSize: 16 }} />,
      wheelchair_accessible: <Accessible sx={{ fontSize: 16 }} />
    };
    return iconMap[key] || null;
  };

  const formatAmenityName = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#666', mb: 2 }}>
        Amenities
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.entries(amenities).map(([key, value]) => {
          if (value === 'No' || value === false) return null;
          
          return (
            <Chip
              key={key}
              icon={getAmenityIcon(key)}
              label={`${formatAmenityName(key)}: ${value === true || value === 'Yes' ? '✓' : value}`}
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

export default Amenities;