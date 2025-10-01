import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Button, Chip, Divider, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import Amenities from './Amenities';
import ContactTemplate from './ContactTemplate';
import DocumentsRequired from './DocumentsRequired';
import RatingTemplate from './RatingTemplate';
import SocialInfoTemplate from './SocialInfoTemplate';
import TransportTemplate from './TransportTemplate';

const RecommendationTemplate = ({ content, index }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [tabStartIndex, setTabStartIndex] = useState(0);
  const maxVisibleTabs = 4;

  // Helper function to get image URL with fallback
  const getImageUrl = () => {
    if (content.main_image && content.main_image.url && content.main_image.url !== 'N/A') {
      return content.main_image.url;
    }
    // Return Lorem Picsum placeholder
    return `https://picsum.photos/200/150?random=${index || Math.random()}`;
  };

  // Helper function to get all available tabs
  const getAvailableTabs = () => {
    const tabs = [
      { id: 'about', label: 'About', condition: true }
    ];

    // Add tips tab
    if (content.tips_and_advice && content.tips_and_advice !== 'N/A') {
      tabs.push({ id: 'tips', label: 'Tips', condition: true });
    }

    // Add maps tab (keeping the old one for backward compatibility)
    if ((content.address && content.address !== 'N/A') || 
        (content.map_links && content.map_links.google_map !== 'N/A') || 
        (content.map_links && content.map_links.naver_map !== 'N/A')) {
      tabs.push({ id: 'maps', label: 'Maps', condition: true });
    }

    // Add contact tab
    if ((content.contact_info && (content.contact_info.phone !== 'N/A' || content.contact_info.email !== 'N/A' || content.contact_info.website !== 'N/A')) ||
        (content.weblink && content.weblink !== 'N/A') ||
        (content.guidance_link && content.guidance_link !== 'N/A')) {
      tabs.push({ id: 'contact', label: 'Contact', condition: true });
    }

    // Add amenity tab
    if ((content.amenities && Object.values(content.amenities).some(val => val === 'Yes')) ||
        (content.accessibility && Object.values(content.accessibility).some(val => val === 'Yes')) ||
        (content.operating_hours && content.operating_hours !== 'N/A')) {
      tabs.push({ id: 'amenity', label: 'Amenity', condition: true });
    }

    // Add documents tab
    if (content.documents_required && 
        content.documents_required !== 'N/A' && 
        typeof content.documents_required === 'object' &&
        Object.keys(content.documents_required).length > 0 &&
        Object.values(content.documents_required).some(val => val && val !== 'N/A' && val.trim() !== '')) {
      tabs.push({ id: 'documents', label: 'Documents', condition: true });
    }

    // Add transport tab
    if (content.how_to_reach && Object.values(content.how_to_reach).some(val => val && val !== 'N/A')) {
      tabs.push({ id: 'transport', label: 'Transport', condition: true });
    }

    // Add social tab
    if (content.social_media && Object.values(content.social_media).some(link => link && link !== 'N/A')) {
      tabs.push({ id: 'social', label: 'Social', condition: true });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();
  const canScrollLeft = tabStartIndex > 0;
  const canScrollRight = tabStartIndex + maxVisibleTabs < availableTabs.length;

  const handleScrollLeft = () => {
    if (canScrollLeft) {
      setTabStartIndex(Math.max(0, tabStartIndex - 1));
    }
  };

  const handleScrollRight = () => {
    if (canScrollRight) {
      setTabStartIndex(Math.min(availableTabs.length - maxVisibleTabs, tabStartIndex + 1));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tips':
        return (
          <Box sx={{ mt: 1, p: 0 }}>
            {content.tips_and_advice && content.tips_and_advice !== 'N/A' && (
              <Typography variant="body2" sx={{ 
                fontSize: '14px', 
                color: '#555', 
                lineHeight: 1.6
              }}>
                {content.tips_and_advice}
              </Typography>
            )}
          </Box>
        );
      case 'maps':
        return (
          <Box sx={{ mt: 1, p: 0 }}>
            {content.address && content.address !== 'N/A' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '13px', color: '#666', mb: 1 }}>
                  <strong>Address:</strong> {content.address}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {content.map_links.google_map && content.map_links.google_map !== 'N/A' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    component="img"
                    src={`${process.env.PUBLIC_URL}/images/google_maps.webp`}
                    alt="Google Maps"
                    sx={{ width: 20, height: 20, objectFit: 'contain' }}
                  />
                  <Typography
                    variant="body2"
                    component="a"
                    href={content.map_links.google_map}
                    target="_blank"
                    sx={{
                      color: '#555',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Google Maps
                  </Typography>
                </Box>
              )}
              {content.map_links.naver_map && content.map_links.naver_map !== 'N/A' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    component="img"
                    src={`${process.env.PUBLIC_URL}/images/naver_maps.png`}
                    alt="Naver Maps"
                    sx={{ width: 20, height: 20, objectFit: 'contain' }}
                  />
                  <Typography
                    variant="body2"
                    component="a"
                    href={content.map_links.naver_map}
                    target="_blank"
                    sx={{
                      color: '#555',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Naver Map
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        );
      case 'contact':
        return <ContactTemplate contactInfo={content.contact_info} guidanceLink={content.guidance_link} />;
      case 'documents':
        return <DocumentsRequired documentsRequired={content.documents_required} />;
      case 'amenity':
        // Combine amenity data excluding operating_hours
        const combinedAmenities = {
          ...(content.amenities || {}),
          ...(content.accessibility || {})
        };
        
        return (
          <Box>
            <Amenities 
              amenities={combinedAmenities} 
            />
          </Box>
        );
      case 'transport':
        return <TransportTemplate howToReach={content.how_to_reach} />;
      case 'social':
        return <SocialInfoTemplate socialMedia={content.social_media} />;
      default: // about
        return (
          <Box sx={{ mt: 1 }}>
            {/* Operating Hours and Languages in separate rows */}
            {((content.operating_hours && content.operating_hours !== 'N/A') || 
              (content.languages && content.languages !== 'N/A')) && (
              <Box sx={{ mb: 0.5}}>
                {/* Operating Hours Row */}
                {content.operating_hours && content.operating_hours !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: '#333', 
                      fontSize: '12px',
                      mr: 1
                    }}>
                      🕒 Hours:
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: '12px',
                      color: '#555'
                    }}>
                      {content.operating_hours}
                    </Typography>
                  </Box>
                )}
                
                {/* Languages Row */}
                {content.languages && content.languages !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: '#333', 
                      fontSize: '12px',
                      mr: 1
                    }}>
                      🗣️ Languages:
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: '12px',
                      color: '#555'
                    }}>
                      {content.languages}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Expat Information */}
            {(content.expat_popularity || content.proximity_to_expat_area || content.recent_visitors) && (
              <Box sx={{ mt: 0.5 }}>
                {/* Expat Popularity Row */}
                {content.expat_popularity && content.expat_popularity !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: '#333', 
                      fontSize: '12px',
                      mr: 1
                    }}>
                      👥 Expat Popularity:
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: '12px',
                      color: '#555'
                    }}>
                      {content.expat_popularity}
                    </Typography>
                  </Box>
                )}
                
                {/* Proximity to Expat Area Row */}
                {content.proximity_to_expat_area && content.proximity_to_expat_area !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: '#333', 
                      fontSize: '12px',
                      mr: 1
                    }}>
                      📍 Proximity to Expat Area:
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: '12px',
                      color: '#555'
                    }}>
                      {content.proximity_to_expat_area}
                    </Typography>
                  </Box>
                )}
                
                {/* Recent Visitors Row */}
                {content.recent_visitors && content.recent_visitors !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: '#333', 
                      fontSize: '12px',
                      mr: 1
                    }}>
                      🚶 Recent Visitors:
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontSize: '12px',
                      color: '#555'
                    }}>
                      {content.recent_visitors}
                    </Typography>
                  </Box>
                )}
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
        gap: 2, 
        mb: 1,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        {/* Left Side - Larger Image */}
        <Box sx={{ 
          flexShrink: 0, 
          width: { xs: '100%', sm: '100%', md: '200px'}, // Increased width
          alignSelf: { xs: 'center', sm: 'flex-start' },
          height: { md: '135px'}, // Increased height
        }}>
          <img 
            src={getImageUrl()}
            alt={content.main_image?.alt_text || content.name || 'Restaurant'}
            style={{
              width: '100%',
              height: { md: '135px'}, // Increased height
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              maxWidth: { md: '180px' , sm: '90%' }
            }}
            onError={(e) => {
              // Fallback to Lorem Picsum if image fails
              e.target.src = `https://picsum.photos/300/200?random=${index || Math.random()}`;
            }}
          />
        </Box>

        {/* Right Side - Content and Tabs */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Title and Category */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '16px', mr: 2 }}>
              {content.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Typography 
                variant="body2"
                sx={{ 
                  color: '#000', 
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {content.category}
              </Typography>
            </Box>
          </Box>
          
          {/* Rating and Other Chips Row */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left side chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <RatingTemplate rating={content.rating} />
              
              {/* Highlight next to rating */}
              {content.highlight && content.highlight !== 'N/A' && (
                <Typography variant="body2" sx={{ 
                  color: '#666', 
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: 1.4,
                  ml: 1
                }}>
                  {content.highlight}
                </Typography>
              )}
              
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
          
          {/* Summary section */}
          {content.summary && content.summary !== 'N/A' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ 
                lineHeight: 1.5, 
                color: '#555', 
                fontSize: '16px'
              }}>
                {content.summary}
              </Typography>
            </Box>
          )}

          {/* Book Chip and Tab Navigation Carousel */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 0 }}>
            {/* Book Chip */}
            <Chip
              label="Book"
              size="small"
              sx={{
                backgroundColor: '#6F95BD',
                color: 'white',
                fontWeight: 500,
                fontSize: '11px',
                minWidth: 70,
                height: 24,
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: '#5a7ba3'
                }
              }}
            />

            {/* Tab Navigation Carousel */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: -1 }}>
              {/* Left Arrow - Hidden on mobile */}
              <IconButton 
                onClick={handleScrollLeft}
                disabled={!canScrollLeft}
                size="small"
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  width: 24, 
                  height: 24, 
                  color: canScrollLeft ? '#6F95BD' : '#ccc',
                  '&:hover': {
                    backgroundColor: canScrollLeft ? 'rgba(111, 149, 189, 0.1)' : 'transparent'
                  }
                }}
              >
                <ChevronLeft sx={{ fontSize: 16 }} />
              </IconButton>

              {/* Tab Container */}
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                overflow: { xs: 'auto', md: 'hidden' },
                width: { 
                  xs: 'calc(100vw - 140px)', // Mobile: smaller overall width
                  md: availableTabs.length <= maxVisibleTabs 
                    ? `${availableTabs.length * (70 + 14) + 100}px` 
                    : `${maxVisibleTabs * (70 + 14) + 100}px`
                },
                position: 'relative',
                // Mobile touch scrolling
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}>
                <Box sx={{
                  display: 'flex',
                  gap: 0.5,
                  ml: 1,
                  transform: { 
                    xs: 'none', // No transform on mobile (native scroll)
                    md: `translateX(-${tabStartIndex * (70 + 4)}px)` 
                  },
                  transition: { 
                    xs: 'none',
                    md: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  },
                  minWidth: 'max-content'
                }}>
                  {availableTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'contained' : 'outlined'}
                      onClick={() => setActiveTab(tab.id)}
                      sx={{ 
                        borderRadius: 4,
                        textTransform: 'none',
                        fontWeight: 500,
                        minWidth: 70,
                        height: 24,
                        fontSize: '11px',
                        ml: 0,
                        backgroundColor: activeTab === tab.id ? '#6F95BD' : 'transparent',
                        color: activeTab === tab.id ? 'white' : '#6F95BD',
                        borderColor: '#6F95BD',
                        flexShrink: 0,
                        '&:hover': {
                          backgroundColor: activeTab === tab.id ? '#6F95BD' : 'rgba(111, 149, 189, 0.1)',
                          borderColor: '#6F95BD'
                        }
                      }}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Right Arrow - Hidden on mobile */}
              <IconButton 
                onClick={handleScrollRight}
                disabled={!canScrollRight}
                size="small"
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  width: 24, 
                  height: 24, 
                  color: canScrollRight ? '#6F95BD' : '#ccc',
                  '&:hover': {
                    backgroundColor: canScrollRight ? 'rgba(111, 149, 189, 0.1)' : 'transparent'
                  }
                }}
              >
                <ChevronRight sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tab Content with Fixed Height - Positioned to align with right side content */}
      <Box sx={{ 
        display: 'flex',
        gap: 0.5
      }}>
        {/* Left Side - Empty space to match image width */}
        <Box sx={{ 
          flexShrink: 0, 
          width: { xs: '0px', sm: '0px', md: '230px'}, 
        }} />
        
        {/* Right Side - Tab Content aligned with above content */}
        <Box sx={{ 
          flex: 1,
          height: { md: '25vh', sm: 220 },
          maxHeight: { md: '125px', sm: 220 },
          overflow: 'auto',
          mt: 1,
          mb: 1,
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