import { AccessTime, Description, DirectionsBus, DirectionsCar, Email, Language, OpenInNew, Phone, Place, Train } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, CircularProgress, Grid, Link, Typography } from '@mui/material';

// Individual template components for each UI element type
const GeneralAnswerTemplate = ({ content }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
      Answer
    </Typography>
    <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#444' }}>
      {content}
    </Typography>
  </Box>
);

const RecommendationTemplate = ({ content, index }) => (
  <Card sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <CardContent sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
            {content.name}
          </Typography>
          <Chip 
            label={content.category} 
            size="small" 
            sx={{ backgroundColor: '#f0f7ff', color: '#1976d2', fontSize: '12px' }}
          />
        </Box>
        {content.weblink && content.weblink !== 'N/A' && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInNew />}
            href={content.weblink}
            target="_blank"
            sx={{ ml: 2 }}
          >
            Visit
          </Button>
        )}
      </Box>

      {/* Highlight */}
      {content.highlight && content.highlight !== 'N/A' && (
        <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic', mb: 2 }}>
          {content.highlight}
        </Typography>
      )}

      {/* Summary */}
      {content.summary && content.summary !== 'N/A' && (
        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
          {content.summary}
        </Typography>
      )}

      {/* Key Info Grid */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Languages */}
        {content.languages && content.languages !== 'N/A' && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Language sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="caption" color="text.secondary">
                {content.languages}
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Operating Hours */}
        {content.operating_hours && content.operating_hours !== 'N/A' && (
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="caption" color="text.secondary">
                {content.operating_hours}
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Address */}
        {content.address && content.address !== 'N/A' && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Place sx={{ fontSize: 16, color: '#666' }} />
              <Typography variant="caption" color="text.secondary">
                {content.address}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Contact Information */}
      {content.contact_info && Object.values(content.contact_info).some(val => val && val !== 'N/A') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
            📞 Contact Information
          </Typography>
          <Box sx={{ pl: 2 }}>
            {content.contact_info.phone && content.contact_info.phone !== 'N/A' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Phone sx={{ fontSize: 14, color: '#666' }} />
                <Typography variant="caption">{content.contact_info.phone}</Typography>
              </Box>
            )}
            {content.contact_info.email && content.contact_info.email !== 'N/A' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Email sx={{ fontSize: 14, color: '#666' }} />
                <Typography variant="caption">{content.contact_info.email}</Typography>
              </Box>
            )}
            {content.contact_info.website && content.contact_info.website !== 'N/A' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <OpenInNew sx={{ fontSize: 14, color: '#666' }} />
                <Link href={content.contact_info.website} target="_blank" variant="caption">
                  {content.contact_info.website}
                </Link>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* How to Reach */}
      {content.how_to_reach && Object.values(content.how_to_reach).some(val => val && val !== 'N/A') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
            🚗 How to Reach
          </Typography>
          <Box sx={{ pl: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {content.how_to_reach.taxi && content.how_to_reach.taxi !== 'N/A' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsCar sx={{ fontSize: 14, color: '#666' }} />
                <Typography variant="caption">Taxi: {content.how_to_reach.taxi}</Typography>
              </Box>
            )}
            {content.how_to_reach.bus && content.how_to_reach.bus !== 'N/A' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsBus sx={{ fontSize: 14, color: '#666' }} />
                <Typography variant="caption">Bus: {content.how_to_reach.bus}</Typography>
              </Box>
            )}
            {content.how_to_reach.metro && content.how_to_reach.metro !== 'N/A' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Train sx={{ fontSize: 14, color: '#666' }} />
                <Typography variant="caption">Metro: {content.how_to_reach.metro}</Typography>
              </Box>
            )}
            {content.how_to_reach.train && content.how_to_reach.train !== 'N/A' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Train sx={{ fontSize: 14, color: '#666' }} />
                <Typography variant="caption">Train: {content.how_to_reach.train}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Documents Required */}
      {content.documents_required && Object.values(content.documents_required).some(val => val && val !== 'N/A') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
            📋 Required Documents
          </Typography>
          <Box sx={{ pl: 2 }}>
            {Object.entries(content.documents_required).map(([key, value]) => {
              if (!value || value === 'N/A') return null;
              return (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Description sx={{ fontSize: 14, color: '#666' }} />
                  <Typography variant="caption">
                    <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Social Media */}
      {content.social_media && Object.values(content.social_media).some(val => val && val !== 'N/A') && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
            📱 Social Media
          </Typography>
          <Box sx={{ pl: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {Object.entries(content.social_media).map(([platform, url]) => {
              if (!url || url === 'N/A') return null;
              return (
                <Link key={platform} href={url} target="_blank" variant="caption" sx={{ color: '#1976d2' }}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Link>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Tips and Advice */}
      {content.tips_and_advice && content.tips_and_advice !== 'N/A' && (
        <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#333', display: 'block', mb: 0.5 }}>
            💡 Tip
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '13px', color: '#555' }}>
            {content.tips_and_advice}
          </Typography>
        </Box>
      )}

      {/* Map Links */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        {content.google_map && content.google_map !== 'N/A' && (
          <Link href={content.google_map} target="_blank" variant="caption" sx={{ color: '#1976d2' }}>
            📍 Google Maps
          </Link>
        )}
        {content.naver_map && content.naver_map !== 'N/A' && (
          <Link href={content.naver_map} target="_blank" variant="caption" sx={{ color: '#1976d2' }}>
            🗺️ Naver Maps
          </Link>
        )}
        {content.guidance_link && content.guidance_link !== 'N/A' && (
          <Link href={content.guidance_link} target="_blank" variant="caption" sx={{ color: '#1976d2' }}>
            ℹ️ More Info
          </Link>
        )}
      </Box>
    </CardContent>
  </Card>
);

const FollowupQuestionsTemplate = ({ content, onFollowUpClick }) => (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
      Related Questions
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {content.map((question, index) => (
        <Button
          key={index}
          variant="outlined"
          onClick={() => onFollowUpClick(question)}
          sx={{
            textAlign: 'left',
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: '#333',
            borderColor: '#e0e0e0',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#1976d2'
            }
          }}
        >
          {question}
        </Button>
      ))}
    </Box>
  </Box>
);

const LoadingTemplate = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
    <CircularProgress size={20} />
    <Typography variant="body2" color="text.secondary">
      Loading more information...
    </Typography>
  </Box>
);

// Main streaming template component
const StreamingSearchTemplate = ({ 
  chunks = {}, 
  isLoading = false, 
  onFollowUpClick,
  onRegenerateAnswer,
  currentQuery,
  onSourcesPanelToggle 
}) => {
  console.log('StreamingSearchTemplate render:', { chunks, isLoading, chunksCount: Object.keys(chunks).length });
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* General Answer */}
      {chunks.general_answer && (
        <GeneralAnswerTemplate content={chunks.general_answer} />
      )}

      {/* Recommendations */}
      {Object.keys(chunks).some(key => key.startsWith('recommendation_')) && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
            Recommendations
          </Typography>
          {Object.keys(chunks)
            .filter(key => key.startsWith('recommendation_'))
            .sort((a, b) => {
              const aIndex = parseInt(a.split('_')[1]);
              const bIndex = parseInt(b.split('_')[1]);
              return aIndex - bIndex;
            })
            .map(key => {
              const index = parseInt(key.split('_')[1]);
              return (
                <RecommendationTemplate
                  key={key}
                  content={chunks[key]}
                  index={index}
                />
              );
            })}
        </Box>
      )}

      {/* Follow-up Questions */}
      {chunks.followup_questions && (
        <FollowupQuestionsTemplate 
          content={chunks.followup_questions} 
          onFollowUpClick={onFollowUpClick}
        />
      )}

      {/* Loading indicator */}
      {isLoading && <LoadingTemplate />}

      {/* Regenerate option */}
      {!isLoading && currentQuery && (
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            variant="text"
            size="small"
            onClick={() => onRegenerateAnswer(currentQuery)}
            sx={{ color: '#666', textTransform: 'none' }}
          >
            🔄 Regenerate answer
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default StreamingSearchTemplate;