import {
  Accessible,
  AccessTime,
  ChairAlt,
  DirectionsCar,
  Elevator,
  Stairs,
  WbSunny,
  Wc
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

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
      ramps: <Stairs sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />,
      elevators: <Elevator sx={{ fontSize: 16 }} />,
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
      ramp: '#9c27b0',           // Purple for ramps (accessibility)
      ramps: '#9c27b0',          // Purple for ramps (accessibility)
      elevator: '#607d8b',       // Blue-grey for elevators
      elevators: '#607d8b',      // Blue-grey for elevators
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {amenities && Object.entries(amenities).map(([key, value]) => {
          // Handle operating_hours specially - always show if it exists and not N/A
          if (key === 'operating_hours' && (!value || value === 'N/A')) return null;
          
          const amenityName = formatAmenityName(key);
          let displayValue;
          
          if (value === true || value === 'Yes') {
            displayValue = '✓';
          } else if (value === false || value === 'No') {
            displayValue = '✗';
          } else {
            displayValue = value;
          }
          
          return (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getAmenityIcon(key) && (
                <Box sx={{ color: getAmenityColor(key), fontSize: 16, display: 'flex', alignItems: 'center' }}>
                  {getAmenityIcon(key)}
                </Box>
              )}
              <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                {amenityName}: {displayValue}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Amenities;