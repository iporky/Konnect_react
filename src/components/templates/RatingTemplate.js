import { Star } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const RatingTemplate = ({ rating }) => {
  if (!rating) return null;

  // Handle both old format (rating as string/number) and new object format
  const averageScore = typeof rating === 'object' ? rating.average_score : rating;
  const numberOfReviews = typeof rating === 'object' ? rating.number_of_reviews : null;

  // Don't render if no valid rating data
  if (!averageScore || averageScore === 'N/A') return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 0, py: 0.5, height: 20 }}>
      <Star sx={{ fontSize: 12, color: '#6f95bd' }} />
      <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600, color: '#6f95bd', fontSize: '12px' }}>
        {averageScore}
        {numberOfReviews && (
          <Typography component="span" sx={{ ml: 0.5, fontSize: '11px', color: '#999' }}>
            ({numberOfReviews} reviews)
          </Typography>
        )}
      </Typography>
    </Box>
  );
};

export default RatingTemplate;