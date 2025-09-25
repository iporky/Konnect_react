import {
  Accessible,
  AccessTime,
  ChairAlt,
  DirectionsCar,
  WbSunny,
  Wc
} from '@mui/icons-material';
import { Box, Chip, Typography } from '@mui/material';

const Amenities = ({ amenities, languages }) => {

  if ((!amenities || Object.keys(amenities).length === 0) && (!languages || languages === 'N/A')) return null;

  const getAmenityIcon = (key) => {
    const iconMap = {
      toilet: <Wc sx={{ fontSize: 16 }} />,
      parking: <DirectionsCar sx={{ fontSize: 16 }} />,
      outdoor_seating: <WbSunny sx={{ fontSize: 16 }} />,
      indoor_seating: <ChairAlt sx={{ fontSize: 16 }} />,
      wheelchair_accessible: <Accessible sx={{ fontSize: 16 }} />,
      wheelchair: <Accessible sx={{ fontSize: 16 }} />,
      operating_hours: <AccessTime sx={{ fontSize: 16 }} />,
      languages: '🌐'
    };
    return iconMap[key] || null;
  };

  const formatAmenityName = (key) => {
    if (key === 'operating_hours') return 'Operating Hours';
    if (key === 'languages') return 'Languages';
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Box sx={{ mt: 2, p: 0 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
        Amenities
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {amenities && Object.entries(amenities).map(([key, value]) => {
          if (value === 'No' || value === false) return null;
          // Handle operating_hours specially - always show if it exists
          if (key === 'operating_hours' && (!value || value === 'N/A')) return null;
          
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
        
        {/* Add Languages chip if provided */}
        {languages && languages !== 'N/A' && (
          <Chip
            icon={getAmenityIcon('languages')}
            label={`Languages: ${languages}`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: '#e0e0e0',
              '& .MuiChip-icon': { color: '#666' }
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Amenities;