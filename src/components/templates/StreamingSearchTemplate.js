import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import GeneralAnswerTemplate from './GeneralAnswerTemplate';
import LoadingTemplate from './LoadingTemplate';
import RecommendationTemplate from './RecommendationTemplate';
import Sources from './Sources';

// Main streaming template component
const StreamingSearchTemplate = ({ 
  chunks = {}, 
  isLoading = false, 
  onFollowUpClick,
  onRegenerateAnswer,
  currentQuery,
  onSourcesPanelToggle,
  onReportClick
}) => {
  console.log('StreamingSearchTemplate render:', { chunks, isLoading, chunksCount: Object.keys(chunks).length });
  
  // Collect all sources from all chunks (not just recommendations)
  const collectSources = () => {
    const allSources = [];
    const seenSources = new Set(); // To avoid duplicates
    
    // Check all chunks for sources
    Object.keys(chunks).forEach(key => {
      const chunk = chunks[key];
      
      if (chunk && chunk.sources) {
        // Handle both single source object and array of sources
        const sourcesToAdd = Array.isArray(chunk.sources) ? chunk.sources : [chunk.sources];
        
        sourcesToAdd.forEach(source => {
          if (source && source.name && source.link) {
            const sourceKey = `${source.name}-${source.link}`;
            if (!seenSources.has(sourceKey)) {
              allSources.push({
                name: source.name,
                link: source.link
              });
              seenSources.add(sourceKey);
            }
          }
        });
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

      {/* Sources and Action Buttons */}
      {sources.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sources 
            sources={sources} 
            onSourcesClick={() => onSourcesPanelToggle && onSourcesPanelToggle(true)}
          />
          
          {/* Copy Button */}
          <IconButton
            size="small"
            onClick={() => {
              const textToCopy = chunks.general_answer || 'Content copied from Konnect';
              navigator.clipboard.writeText(textToCopy).then(() => {
                // Could add a toast notification here
                console.log('Content copied to clipboard');
              }).catch(() => {
                console.log('Failed to copy content');
              });
            }}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              '&:hover': {
                borderColor: '#3289C9',
                backgroundColor: '#f0f7ff'
              }
            }}
          >
            <Tooltip title="Copy">
              <Box sx={{ fontSize: '16px' }}>📋</Box>
            </Tooltip>
          </IconButton>
          
          {/* Report Button */}
          <IconButton
            size="small"
            onClick={() => onReportClick && onReportClick()}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              '&:hover': {
                borderColor: '#3289C9',
                backgroundColor: '#f0f7ff'
              }
            }}
          >
            <Tooltip title="Report">
              <Box sx={{ fontSize: '16px' }}>🚩</Box>
            </Tooltip>
          </IconButton>
        </Box>
      )}
      {/* Loading indicator */}
      {isLoading && <LoadingTemplate />}
    </Box>
  );
};

export default StreamingSearchTemplate;