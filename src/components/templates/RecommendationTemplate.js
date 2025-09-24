import { DirectionsBus, DirectionsCar, Language, Star, Train } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Link, Typography } from '@mui/material';
import { useState } from 'react';
import Amenities from './Amenities';
import DocumentsRequired from './DocumentsRequired';
import SocialInfoTemplate from './SocialInfoTemplate';

const RecommendationTemplate = ({ content, index }) => {
  const [activeTab, setActiveTab] = useState('about');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'maps':
        return (
          <Box sx={{ mt: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
              📍 Location & Maps
            </Typography>
            {content.address && content.address !== 'N/A' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '13px', color: '#666', mb: 1 }}>
                  <strong>Address:</strong> {content.address}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {content.google_map && content.google_map !== 'N/A' && (
                <Button
                  variant="outlined"
                  size="small"
                  href={content.google_map}
                  target="_blank"
                  sx={{ borderRadius: 3, textTransform: 'none' }}
                >
                  📍 Google Maps
                </Button>
              )}
              {content.naver_map && content.naver_map !== 'N/A' && (
                <Button
                  variant="outlined"
                  size="small"
                  href={content.naver_map}
                  target="_blank"
                  sx={{ borderRadius: 3, textTransform: 'none' }}
                >
                  🗺️ Naver Maps
                </Button>
              )}
            </Box>
          </Box>
        );
      case 'contact':
        return (
          <Box sx={{ mt: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
              📞 Contact Information
            </Typography>
            {content.contact_info && (
              <Box>
                {content.contact_info.phone && content.contact_info.phone !== 'N/A' && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '13px', color: '#666' }}>
                      <strong>Phone:</strong> {content.contact_info.phone}
                    </Typography>
                  </Box>
                )}
                {content.contact_info.email && content.contact_info.email !== 'N/A' && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '13px', color: '#666' }}>
                      <strong>Email:</strong> {content.contact_info.email}
                    </Typography>
                  </Box>
                )}
                {content.contact_info.website && content.contact_info.website !== 'N/A' && (
                  <Box sx={{ mb: 1 }}>
                    <Link href={content.contact_info.website} target="_blank" sx={{ fontSize: '13px' }}>
                      🌐 Website
                    </Link>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Website Link */}
            {content.weblink && content.weblink !== 'N/A' && (
              <Box sx={{ mt: 2 }}>
                <Link href={content.weblink} target="_blank" sx={{ fontSize: '13px' }}>
                  🌐 Official Website
                </Link>
              </Box>
            )}
            
            {/* Guidance Link */}
            {content.guidance_link && content.guidance_link !== 'N/A' && (
              <Box sx={{ mt: 1 }}>
                <Link href={content.guidance_link} target="_blank" sx={{ fontSize: '13px' }}>
                  📋 Visitor Guide
                </Link>
              </Box>
            )}
          </Box>
        );
      case 'amenity':
        // Combine all amenity-related data
        const combinedAmenities = {
          ...(content.amenities || {}),
          ...(content.accessibility || {}),
          ...(content.operating_hours && content.operating_hours !== 'N/A' && {
            operating_hours: content.operating_hours
          })
        };
        
        return (
          <Box>
            <Amenities amenities={combinedAmenities} />
          </Box>
        );
      case 'transport':
        return (
          <Box sx={{ mt: 3, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
              🚗 How to Reach
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {content.how_to_reach && (
                <>
                  {content.how_to_reach.taxi && content.how_to_reach.taxi !== 'N/A' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DirectionsCar sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ fontSize: '13px' }}>
                        Taxi: {content.how_to_reach.taxi}
                      </Typography>
                    </Box>
                  )}
                  {content.how_to_reach.bus && content.how_to_reach.bus !== 'N/A' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DirectionsBus sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ fontSize: '13px' }}>
                        Bus: {content.how_to_reach.bus}
                      </Typography>
                    </Box>
                  )}
                  {content.how_to_reach.metro && content.how_to_reach.metro !== 'N/A' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Train sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ fontSize: '13px' }}>
                        Metro: {content.how_to_reach.metro}
                      </Typography>
                    </Box>
                  )}
                  {content.how_to_reach.train && content.how_to_reach.train !== 'N/A' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Train sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ fontSize: '13px' }}>
                        Train: {content.how_to_reach.train}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        );
      case 'social':
        return <SocialInfoTemplate socialMedia={content.social_media} />;
      default: // about
        return (
          <Box sx={{ mt: 3 }}>
            {content.summary && content.summary !== 'N/A' && (
              <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6, color: '#555', fontSize: '14px' }}>
                {content.summary}
              </Typography>
            )}
            
            {/* English Guidance */}
            {content.english_guidance && content.english_guidance !== 'N/A' && (
              <Box sx={{ 
                p: 2.5, 
                backgroundColor: '#e8f5e8', 
                borderRadius: 2, 
                mb: 2,
                border: '1px solid #4caf50'
              }}>
                <Typography variant="body2" sx={{ 
                  fontWeight: 600, 
                  color: '#2e7d32', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  fontSize: '13px'
                }}>
                  <Language sx={{ fontSize: 16 }} />
                  English Support
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '13px', color: '#2e7d32', lineHeight: 1.5 }}>
                  {content.english_guidance}
                </Typography>
              </Box>
            )}
            
            {/* Expat Information */}
            {(content.expat_popularity || content.proximity_to_expat_area || content.recent_visitors) && (
              <Box sx={{ 
                p: 2.5, 
                backgroundColor: '#f3e5f5', 
                borderRadius: 2, 
                mb: 2,
                border: '1px solid #9c27b0'
              }}>
                <Typography variant="body2" sx={{ 
                  fontWeight: 600, 
                  color: '#7b1fa2', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  fontSize: '13px'
                }}>
                  🌍 Expat Friendly
                </Typography>
                {content.expat_popularity && content.expat_popularity !== 'N/A' && (
                  <Typography variant="body2" sx={{ fontSize: '13px', color: '#7b1fa2', lineHeight: 1.5, mb: 0.5 }}>
                    Popularity: {content.expat_popularity}
                  </Typography>
                )}
                {content.proximity_to_expat_area && content.proximity_to_expat_area !== 'N/A' && (
                  <Typography variant="body2" sx={{ fontSize: '13px', color: '#7b1fa2', lineHeight: 1.5, mb: 0.5 }}>
                    Location: {content.proximity_to_expat_area}
                  </Typography>
                )}
                {content.recent_visitors && content.recent_visitors !== 'N/A' && (
                  <Typography variant="body2" sx={{ fontSize: '13px', color: '#7b1fa2', lineHeight: 1.5 }}>
                    Visitors: {content.recent_visitors}
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Languages */}
            {content.languages && content.languages !== 'N/A' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '13px', color: '#666', mb: 1 }}>
                  <strong>Languages:</strong> {content.languages}
                </Typography>
              </Box>
            )}
            
            {content.tips_and_advice && content.tips_and_advice !== 'N/A' && (
              <Box sx={{ 
                p: 2.5, 
                backgroundColor: '#fff9e6', 
                borderRadius: 2, 
                mb: 2,
                border: '1px solid #ffeaa7'
              }}>
                <Typography variant="body2" sx={{ 
                  fontWeight: 600, 
                  color: '#b8860b', 
                  display: 'block', 
                  mb: 1,
                  fontSize: '13px'
                }}>
                  💡 Helpful Tip
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                  {content.tips_and_advice}
                </Typography>
              </Box>
            )}
            
            {/* Documents Required */}
            <DocumentsRequired documentsRequired={content.documents_required} />
          </Box>
        );
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '18px' }}>
                {content.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ fontSize: 16, color: '#ff6b35' }} />
                <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600, color: '#666' }}>
                  N/A
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip 
                label={content.category} 
                size="small" 
                sx={{ 
                  backgroundColor: '#fce4ec', 
                  color: '#c2185b', 
                  fontSize: '11px',
                  fontWeight: 600,
                  height: 24,
                  borderRadius: 4
                }}
              />
            </Box>
            
            {content.highlight && content.highlight !== 'N/A' && (
              <Typography variant="body2" sx={{ 
                color: '#666', 
                fontSize: '14px',
                fontWeight: 500,
                mt: 1
              }}>
                {content.highlight}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Main Image */}
        {content.main_image && content.main_image.url && content.main_image.url !== 'N/A' && (
          <Box sx={{ mb: 3 }}>
            <img 
              src={content.main_image.url} 
              alt={content.main_image.alt_text || content.name}
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Box>
        )}

        {/* Tab Navigation */}
        <Box sx={{ display: 'flex', gap: 1, mb: 0, flexWrap: 'wrap' }}>
          <Button
            variant={activeTab === 'about' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setActiveTab('about')}
            sx={{ 
              borderRadius: 4,
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 80,
              backgroundColor: activeTab === 'about' ? '#c2185b' : 'transparent',
              color: activeTab === 'about' ? 'white' : '#c2185b',
              borderColor: '#c2185b',
              '&:hover': {
                backgroundColor: activeTab === 'about' ? '#c2185b' : 'rgba(194, 24, 91, 0.1)',
                borderColor: '#c2185b'
              }
            }}
          >
            About
          </Button>
          
          {/* Only show Maps tab if address or map links exist */}
          {(content.address && content.address !== 'N/A') || 
           (content.google_map && content.google_map !== 'N/A') || 
           (content.naver_map && content.naver_map !== 'N/A') ? (
            <Button
              variant={activeTab === 'maps' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setActiveTab('maps')}
              sx={{ 
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 80,
                backgroundColor: activeTab === 'maps' ? '#c2185b' : 'transparent',
                color: activeTab === 'maps' ? 'white' : '#c2185b',
                borderColor: '#c2185b',
                '&:hover': {
                  backgroundColor: activeTab === 'maps' ? '#c2185b' : 'rgba(194, 24, 91, 0.1)',
                  borderColor: '#c2185b'
                }
              }}
            >
              Maps
            </Button>
          ) : null}
          
          {/* Only show Contact tab if contact info, weblink, or guidance_link exist */}
          {((content.contact_info && (content.contact_info.phone !== 'N/A' || content.contact_info.email !== 'N/A' || content.contact_info.website !== 'N/A')) ||
           (content.weblink && content.weblink !== 'N/A') ||
           (content.guidance_link && content.guidance_link !== 'N/A')) ? (
            <Button
              variant={activeTab === 'contact' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setActiveTab('contact')}
              sx={{ 
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 80,
                backgroundColor: activeTab === 'contact' ? '#c2185b' : 'transparent',
                color: activeTab === 'contact' ? 'white' : '#c2185b',
                borderColor: '#c2185b',
                '&:hover': {
                  backgroundColor: activeTab === 'contact' ? '#c2185b' : 'rgba(194, 24, 91, 0.1)',
                  borderColor: '#c2185b'
                }
              }}
            >
              Contact
            </Button>
          ) : null}
          
          {/* Only show Amenity tab if amenities, accessibility, or operating hours exist */}
          {((content.amenities && Object.values(content.amenities).some(val => val === 'Yes')) ||
           (content.accessibility && Object.values(content.accessibility).some(val => val === 'Yes')) ||
           (content.operating_hours && content.operating_hours !== 'N/A')) ? (
            <Button
              variant={activeTab === 'amenity' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setActiveTab('amenity')}
              sx={{ 
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 80,
                backgroundColor: activeTab === 'amenity' ? '#c2185b' : 'transparent',
                color: activeTab === 'amenity' ? 'white' : '#c2185b',
                borderColor: '#c2185b',
                '&:hover': {
                  backgroundColor: activeTab === 'amenity' ? '#c2185b' : 'rgba(194, 24, 91, 0.1)',
                  borderColor: '#c2185b'
                }
              }}
            >
              Amenity
            </Button>
          ) : null}
          
          {/* Only show Transport tab if how_to_reach data exists and has non-N/A values */}
          {(content.how_to_reach && Object.values(content.how_to_reach).some(val => val && val !== 'N/A')) ? (
            <Button
              variant={activeTab === 'transport' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setActiveTab('transport')}
              sx={{ 
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 80,
                backgroundColor: activeTab === 'transport' ? '#c2185b' : 'transparent',
                color: activeTab === 'transport' ? 'white' : '#c2185b',
                borderColor: '#c2185b',
                '&:hover': {
                  backgroundColor: activeTab === 'transport' ? '#c2185b' : 'rgba(194, 24, 91, 0.1)',
                  borderColor: '#c2185b'
                }
              }}
            >
              Transport
            </Button>
          ) : null}
          
          {/* Only show Social tab if social media links exist */}
          {(content.social_media && Object.values(content.social_media).some(link => link && link !== 'N/A')) ? (
            <Button
              variant={activeTab === 'social' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setActiveTab('social')}
              sx={{ 
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 80,
                backgroundColor: activeTab === 'social' ? '#c2185b' : 'transparent',
                color: activeTab === 'social' ? 'white' : '#c2185b',
                borderColor: '#c2185b',
                '&:hover': {
                  backgroundColor: activeTab === 'social' ? '#c2185b' : 'rgba(194, 24, 91, 0.1)',
                  borderColor: '#c2185b'
                }
              }}
            >
              Social
            </Button>
          ) : null}
        </Box>
      </Box>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Divider */}
      <Divider sx={{ mt: 4, opacity: 0.3 }} />
    </Box>
  );
};

export default RecommendationTemplate;