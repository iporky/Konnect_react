import { DirectionsBus, DirectionsCar, Train } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const TransportTemplate = ({ howToReach }) => {
  if (!howToReach || !Object.values(howToReach).some(val => val && val !== 'N/A')) {
    return null;
  }

  return (
    <Box sx={{ mt: 1, p: 0 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {howToReach.taxi && howToReach.taxi !== 'N/A' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DirectionsCar sx={{ fontSize: 16, color: '#ff9800', display: 'flex', alignItems: 'center' }} />
            <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
              Taxi: {howToReach.taxi}
            </Typography>
          </Box>
        )}
        {howToReach.bus && howToReach.bus !== 'N/A' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DirectionsBus sx={{ fontSize: 16, color: '#2196f3', display: 'flex', alignItems: 'center' }} />
            <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
              Bus: {howToReach.bus}
            </Typography>
          </Box>
        )}
        {howToReach.metro && howToReach.metro !== 'N/A' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Train sx={{ fontSize: 16, color: '#4caf50', display: 'flex', alignItems: 'center' }} />
            <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
              Metro: {howToReach.metro}
            </Typography>
          </Box>
        )}
        {howToReach.train && howToReach.train !== 'N/A' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Train sx={{ fontSize: 16, color: '#9c27b0', display: 'flex', alignItems: 'center' }} />
            <Typography variant="body2" sx={{ fontSize: '13px', display: 'flex', alignItems: 'center' }}>
              Train: {howToReach.train}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TransportTemplate;