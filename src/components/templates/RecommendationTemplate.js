import { DirectionsBus, DirectionsCar, Star, Train } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import Amenities from './Amenities';
import DocumentsRequired from './DocumentsRequired';
import SocialInfoTemplate from './SocialInfoTemplate';

const RecommendationTemplate = ({ content, index }) => {
  const [activeTab, setActiveTab] = useState('about');

  // Helper function to get image URL with fallback
  const getImageUrl = () => {
    if (content.main_image && content.main_image.url && content.main_image.url !== 'N/A') {
      return content.main_image.url;
    }
    // Return Lorem Picsum placeholder
    return `https://picsum.photos/200/150?random=${index || Math.random()}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'maps':
        return (
          <Box sx={{ mt: 3, p: 0 }}>
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
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
          <Box sx={{ mt: 3, p: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
              📞 Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {content.contact_info && (
                <>
                  {content.contact_info.phone && content.contact_info.phone !== 'N/A' && (
                    <Chip
                      label={`📞 ${content.contact_info.phone}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0'
                      }}
                    />
                  )}
                  {content.contact_info.email && content.contact_info.email !== 'N/A' && (
                    <Chip
                      label={`✉️ ${content.contact_info.email}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0'
                      }}
                    />
                  )}
                  {content.contact_info.website && content.contact_info.website !== 'N/A' && (
                    <Chip
                      label="🌐 Website"
                      size="small"
                      variant="outlined"
                      component="a"
                      href={content.contact_info.website}
                      target="_blank"
                      clickable
                      sx={{
                        borderColor: '#e0e0e0',
                        textDecoration: 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)'
                        }
                      }}
                    />
                  )}
                </>
              )}
              
              {/* Website Link */}
              {content.weblink && content.weblink !== 'N/A' && (
                <Chip
                  label="🌐 Official Website"
                  size="small"
                  variant="outlined"
                  component="a"
                  href={content.weblink}
                  target="_blank"
                  clickable
                  sx={{
                    borderColor: '#e0e0e0',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    }
                  }}
                />
              )}
              
              {/* Guidance Link */}
              {content.guidance_link && content.guidance_link !== 'N/A' && (
                <Chip
                  label="📋 Visitor Guide"
                  size="small"
                  variant="outlined"
                  component="a"
                  href={content.guidance_link}
                  target="_blank"
                  clickable
                  sx={{
                    borderColor: '#e0e0e0',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    }
                  }}
                />
              )}
            </Box>
          </Box>
        );
      case 'documents':
        return <DocumentsRequired documentsRequired={content.documents_required} />;
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
            <Amenities 
              amenities={combinedAmenities} 
              languages={content.languages}
            />
          </Box>
        );
      case 'transport':
        return (
          <Box sx={{ mt: 3, p: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
              🚗 How to Reach
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {content.how_to_reach && (
                <>
                  {content.how_to_reach.taxi && content.how_to_reach.taxi !== 'N/A' && (
                    <Chip
                      icon={<DirectionsCar sx={{ fontSize: 16 }} />}
                      label={`Taxi: ${content.how_to_reach.taxi}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0',
                        '& .MuiChip-icon': { color: '#4caf50' }
                      }}
                    />
                  )}
                  {content.how_to_reach.bus && content.how_to_reach.bus !== 'N/A' && (
                    <Chip
                      icon={<DirectionsBus sx={{ fontSize: 16 }} />}
                      label={`Bus: ${content.how_to_reach.bus}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0',
                        '& .MuiChip-icon': { color: '#4caf50' }
                      }}
                    />
                  )}
                  {content.how_to_reach.metro && content.how_to_reach.metro !== 'N/A' && (
                    <Chip
                      icon={<Train sx={{ fontSize: 16 }} />}
                      label={`Metro: ${content.how_to_reach.metro}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0',
                        '& .MuiChip-icon': { color: '#4caf50' }
                      }}
                    />
                  )}
                  {content.how_to_reach.train && content.how_to_reach.train !== 'N/A' && (
                    <Chip
                      icon={<Train sx={{ fontSize: 16 }} />}
                      label={`Train: ${content.how_to_reach.train}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0',
                        '& .MuiChip-icon': { color: '#4caf50' }
                      }}
                    />
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
            
            {/* Expat Information */}
            {(content.expat_popularity || content.proximity_to_expat_area || content.recent_visitors) && (
              <Box sx={{ 
                p: 0, 
                mb: 2
              }}>
                <Typography variant="body2" sx={{ 
                  fontWeight: 600, 
                  color: '#333', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  fontSize: '13px'
                }}>
                  🌍 Expat Friendly
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {content.expat_popularity && content.expat_popularity !== 'N/A' && (
                    <Chip
                      label={`Popularity: ${content.expat_popularity}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0'
                      }}
                    />
                  )}
                  {content.proximity_to_expat_area && content.proximity_to_expat_area !== 'N/A' && (
                    <Chip
                      label={`Location: ${content.proximity_to_expat_area}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0'
                      }}
                    />
                  )}
                  {content.recent_visitors && content.recent_visitors !== 'N/A' && (
                    <Chip
                      label={`Visitors: ${content.recent_visitors}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#e0e0e0'
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        );
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Main Horizontal Layout - Image Left, Content and Tabs Right */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 1,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        {/* Left Side - Larger Image */}
        <Box sx={{ 
          flexShrink: 0, 
          width: { xs: '100%', sm: 250 }, // Increased width
          alignSelf: { xs: 'center', sm: 'flex-start' }
        }}>
          <img 
            src={getImageUrl()}
            alt={content.main_image?.alt_text || content.name || 'Restaurant'}
            style={{
              width: '100%',
              height: '220px', // Increased height
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              maxWidth: '250px'
            }}
            onError={(e) => {
              // Fallback to Lorem Picsum if image fails
              e.target.src = `https://picsum.photos/300/200?random=${index || Math.random()}`;
            }}
          />
        </Box>

        {/* Right Side - Content and Tabs */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Title and Rating */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '18px', mr: 2 }}>
              {content.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Star sx={{ fontSize: 16, color: '#ff6b35' }} />
              <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600, color: '#666' }}>
                {content.rating || 'N/A'}
              </Typography>
            </Box>
          </Box>
          
          {/* Chips Row */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left side chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
              {/* Additional chips based on content */}
              {content.price_range && content.price_range !== 'N/A' && (
                <Chip 
                  label={content.price_range} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#e8f5e8', 
                    color: '#2e7d32', 
                    fontSize: '11px',
                    fontWeight: 600,
                    height: 24,
                    borderRadius: 4
                  }}
                />
              )}
              {content.cuisine_type && content.cuisine_type !== 'N/A' && (
                <Chip 
                  label={content.cuisine_type} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#fff3e0', 
                    color: '#e65100', 
                    fontSize: '11px',
                    fontWeight: 600,
                    height: 24,
                    borderRadius: 4
                  }}
                />
              )}
            </Box>
          </Box>
          
          {/* Show tip text directly below chips if it exists */}
          {content.tips_and_advice && content.tips_and_advice !== 'N/A' && (
            <Typography variant="body2" sx={{ 
              fontSize: '12px', 
              color: '#1976d2', 
              fontStyle: 'italic',
              mb: 1,
              lineHeight: 1.4
            }}>
              💡Tip: {content.tips_and_advice}
            </Typography>
          )}
          
          {/* Description */}
          {content.highlight && content.highlight !== 'N/A' && (
            <Typography variant="body2" sx={{ 
              color: '#666', 
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.5,
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {content.highlight}
            </Typography>
          )}

          {/* Tab Navigation - Now positioned next to the image */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Button
              variant={activeTab === 'about' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setActiveTab('about')}
              sx={{ 
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 70,
                fontSize: '11px',
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
                  minWidth: 70,
                  fontSize: '11px',
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
                  minWidth: 70,
                  fontSize: '11px',
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
                  minWidth: 70,
                  fontSize: '11px',
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
            
            {/* Only show Documents tab if documents_required data exists */}
            {(content.documents_required && 
             content.documents_required !== 'N/A' && 
             typeof content.documents_required === 'object' &&
             Object.keys(content.documents_required).length > 0 &&
             Object.values(content.documents_required).some(val => val && val !== 'N/A' && val.trim() !== '')) ? (
              <Button
                variant={activeTab === 'documents' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setActiveTab('documents')}
                sx={{ 
                  borderRadius: 4,
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: 70,
                  fontSize: '11px',
                  backgroundColor: activeTab === 'documents' ? '#c2185b' : 'transparent',
                  color: activeTab === 'documents' ? 'white' : '#c2185b',
                  borderColor: '#c2185b',
                  '&:hover': {
                    backgroundColor: activeTab === 'documents' ? '#c2185b' : 'rgba(194, 24, 91, 0.1)',
                    borderColor: '#c2185b'
                  }
                }}
              >
                Documents
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
                  minWidth: 70,
                  fontSize: '11px',
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
                  minWidth: 70,
                  fontSize: '11px',
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

          {/* Contact Info Chips - moved below tabs */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {content.contact_info?.phone && content.contact_info.phone !== 'N/A' && (
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
                📞 {content.contact_info.phone}
              </Typography>
            )}
            {content.address && content.address !== 'N/A' && (
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
                📍 {content.address.length > 30 ? content.address.substring(0, 30) + '...' : content.address}
              </Typography>
            )}
            {content.operating_hours && content.operating_hours !== 'N/A' && (
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
                🕒 {content.operating_hours}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Tab Content with Fixed Height */}
      <Box sx={{ 
        height: { md: 150, sm: 220 }, // Reduced from 300px to 200px
        overflow: 'auto', // Allow scrolling if content exceeds height
        mt: 1, // Small margin top
        mb: 1, // Margin bottom before divider
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '3px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '3px',
          '&:hover': {
            backgroundColor: '#a8a8a8'
          }
        }
      }}>
        {renderTabContent()}
      </Box>

      {/* HR Line after each recommendation */}
      <Divider sx={{ 
        mt: 2, 
        mb: 2, 
        opacity: 0.6,
        borderBottomWidth: 2,
        borderColor: '#e0e0e0'
      }} />
    </Box>
  );
};

export default RecommendationTemplate;