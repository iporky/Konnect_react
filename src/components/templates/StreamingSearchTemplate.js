import { Box, Button, Typography } from '@mui/material';
import Sources from './Sources';
import GeneralAnswerTemplate from './GeneralAnswerTemplate';
import RecommendationTemplate from './RecommendationTemplate';
import FollowupQuestionsTemplate from './FollowupQuestionsTemplate';
import LoadingTemplate from './LoadingTemplate';

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
  
  // Collect all sources from recommendations
  const collectSources = () => {
    const allSources = [];
    const seenSources = new Set(); // To avoid duplicates
    
    Object.keys(chunks)
      .filter(key => key.startsWith('recommendation_'))
      .forEach(key => {
        const recommendation = chunks[key];
        if (recommendation.sources) {
          const sourceKey = `${recommendation.sources.name}-${recommendation.sources.link}`;
          if (!seenSources.has(sourceKey)) {
            allSources.push({
              name: recommendation.sources.name,
              link: recommendation.sources.link
            });
            seenSources.add(sourceKey);
          }
        }
      });
    
    return allSources;
  };
  
  const sources = collectSources();
  
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

      {/* Sources - show collected sources from all recommendations */}
      {sources.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Sources 
            sources={sources} 
            onSourcesClick={() => onSourcesPanelToggle && onSourcesPanelToggle(true)}
          />
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