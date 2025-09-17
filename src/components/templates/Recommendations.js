import {
    DirectionsBus,
    DirectionsCar,
    Email,
    Facebook,
    Instagram,
    Language,
    LocationOn,
    Map,
    Phone,
    RateReview,
    Schedule,
    Star,
    Train,
    YouTube
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Link,
    Rating,
    Typography,
    useTheme
} from '@mui/material';

const RecommendationCard = ({ recommendation, index }) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
      {recommendation.main_image?.url && (
        <CardMedia
          component="img"
          height="200"
          image={recommendation.main_image.url}
          alt={recommendation.main_image.alt_text || recommendation.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {recommendation.name}
            </Typography>
            <Chip 
              label={recommendation.category} 
              size="small" 
              sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
            />
          </Box>
          {recommendation.rating && recommendation.rating !== 'N/A' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={parseFloat(recommendation.rating)} readOnly size="small" />
              <Typography variant="caption">({recommendation.rating})</Typography>
            </Box>
          )}
        </Box>

        {/* Highlight */}
        {recommendation.highlight && (
          <Typography variant="body2" sx={{ 
            color: '#666', 
            fontStyle: 'italic', 
            mb: 2,
            backgroundColor: '#fff3e0',
            p: 1,
            borderRadius: 1,
            borderLeft: '3px solid #ff9800'
          }}>
            {recommendation.highlight}
          </Typography>
        )}

        {/* Summary */}
        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
          {recommendation.summary}
        </Typography>

        {/* Contact Info */}
        {recommendation.contact_info && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Contact</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {recommendation.contact_info.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="caption">{recommendation.contact_info.phone}</Typography>
                </Box>
              )}
              {recommendation.contact_info.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="caption">{recommendation.contact_info.email}</Typography>
                </Box>
              )}
              {recommendation.contact_info.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Language sx={{ fontSize: 16, color: '#666' }} />
                  <Link href={recommendation.contact_info.website} target="_blank" rel="noopener noreferrer">
                    <Typography variant="caption">Visit Website</Typography>
                  </Link>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Operating Hours */}
        {recommendation.operating_hours && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="caption">{recommendation.operating_hours}</Typography>
            </Box>
          </Box>
        )}

        {/* Address */}
        {recommendation.contact_info?.address && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="caption">{recommendation.contact_info.address}</Typography>
            </Box>
          </Box>
        )}

        {/* How to Reach */}
        {recommendation.how_to_reach && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>How to Reach</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {recommendation.how_to_reach.metro && (
                <Chip icon={<Train />} label={`Metro: ${recommendation.how_to_reach.metro}`} size="small" variant="outlined" />
              )}
              {recommendation.how_to_reach.bus && (
                <Chip icon={<DirectionsBus />} label={`Bus: ${recommendation.how_to_reach.bus}`} size="small" variant="outlined" />
              )}
              {recommendation.how_to_reach.taxi && (
                <Chip icon={<DirectionsCar />} label={`Taxi: ${recommendation.how_to_reach.taxi}`} size="small" variant="outlined" />
              )}
            </Box>
          </Box>
        )}

        {/* Tips */}
        {recommendation.tips_and_advice && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Tips & Advice</Typography>
            <Typography variant="body2" sx={{ 
              backgroundColor: '#f0f7ff', 
              p: 1.5, 
              borderRadius: 1,
              fontSize: '0.875rem'
            }}>
              {recommendation.tips_and_advice}
            </Typography>
          </Box>
        )}

        {/* Map Links */}
        {recommendation.map_links && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Maps</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {recommendation.map_links.naver_map && (
                <Link 
                  href={recommendation.map_links.naver_map} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none' }}
                >
                  <Chip 
                    icon={<Map />} 
                    label="Naver Map" 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      cursor: 'pointer'
                    }}
                  />
                </Link>
              )}
              {recommendation.map_links.google_map && (
                <Link 
                  href={recommendation.map_links.google_map} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none' }}
                >
                  <Chip 
                    icon={<Map />} 
                    label="Google Map" 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      cursor: 'pointer'
                    }}
                  />
                </Link>
              )}
            </Box>
          </Box>
        )}

        {/* Reviews */}
        {recommendation.reviews && recommendation.reviews.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <RateReview sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Reviews</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recommendation.reviews.map((review, reviewIndex) => (
                <Box 
                  key={reviewIndex}
                  sx={{ 
                    backgroundColor: '#f9f9f9', 
                    p: 1.5, 
                    borderRadius: 1,
                    borderLeft: '3px solid #4caf50'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Star sx={{ fontSize: 14, color: '#ffc107' }} />
                    <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#666' }}>
                      User Review
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    "{review}"
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Social Media */}
        {recommendation.social_media && (
          <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
            {recommendation.social_media.facebook && recommendation.social_media.facebook !== 'No channel' && (
              <IconButton size="small" href={recommendation.social_media.facebook} target="_blank">
                <Facebook sx={{ color: '#1877f2' }} />
              </IconButton>
            )}
            {recommendation.social_media.instagram && recommendation.social_media.instagram !== 'No channel' && (
              <IconButton size="small" href={recommendation.social_media.instagram} target="_blank">
                <Instagram sx={{ color: '#e4405f' }} />
              </IconButton>
            )}
            {recommendation.social_media.youtube && recommendation.social_media.youtube !== 'No channel' && (
              <IconButton size="small" href={recommendation.social_media.youtube} target="_blank">
                <YouTube sx={{ color: '#ff0000' }} />
              </IconButton>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const Recommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#3289C9' }}>
        Recommendations
      </Typography>
      {recommendations.map((recommendation, index) => (
        <RecommendationCard key={index} recommendation={recommendation} index={index} />
      ))}
    </Box>
  );
};

export default Recommendations;