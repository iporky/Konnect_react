import {
  Accessible,
  AccessTime,
  ChairAlt,
  DirectionsCar,
  WbSunny,
  Wc
} from '@mui/icons-material';
import { Box, Chip } from '@mui/material';

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

  const getAmenityColor = (key) => {
    const colorMap = {
      toilet: '#2196f3',          // Blue for toilet
      parking: '#ff9800',         // Orange for parking
      outdoor_seating: '#4caf50', // Green for outdoor seating
      indoor_seating: '#795548',  // Brown for indoor seating
      wheelchair_accessible: '#9c27b0', // Purple for accessibility
      wheelchair: '#9c27b0',      // Purple for wheelchair
      operating_hours: '#f44336', // Red for operating hours
      languages: '#607d8b'        // Blue-grey for languages
    };
    return colorMap[key] || '#666';
  };

  const formatAmenityName = (key) => {
    if (key === 'operating_hours') return 'Operating Hours';
    if (key === 'languages') return 'Languages';
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Box sx={{ mt: 2, p: 0 }}>
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
                height: 24,
                '& .MuiChip-icon': { color: getAmenityColor(key) }
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Amenities;