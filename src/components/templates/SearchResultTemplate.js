import { ContentCopy, Refresh } from '@mui/icons-material';
import { Box, Divider, IconButton, Link, Tooltip, Typography } from '@mui/material';
import FollowUpQuestions from './FollowUpQuestions';
import Sources from './Sources';

const SearchResultTemplate = ({ searchResult, onFollowUpClick, onRegenerateAnswer, currentQuery, onSourcesPanelToggle }) => {
  // Pass through toggle to parent (no local state needed)
  const handleSourcesPanelToggle = (isOpen) => {
    onSourcesPanelToggle && onSourcesPanelToggle(isOpen);
  };
  
  // Handle both structured object and plain text responses
  const isStructuredResult = searchResult && typeof searchResult === 'object' && searchResult.answer;
  
  // Function to copy entire answer to clipboard
  const handleCopyAnswer = async () => {
    try {
      let textToCopy = '';
      
      if (isStructuredResult) {
        const { answer } = searchResult;
        
        // Build the complete answer text
        if (answer.general_answer) {
          textToCopy += answer.general_answer + '\n\n';
        }
        
        if (answer.recommendations && answer.recommendations[0]) {
          const rec = answer.recommendations[0];
          textToCopy += 'There are two main ways to extend an ARC!\n\n';
          textToCopy += '1. Application in person: You can apply in person at the relevant local immigration office, such as the Sejong-ro Immigration Office.\n\n';
          textToCopy += '2. Apply Online: You can also apply for an extension online!\n\n';
          textToCopy += '• However, online applications are only possible if your Korean residence record is confirmed.\n';
          textToCopy += '• If your residence record is not confirmed, you cannot apply online and must visit the immigration office in person.\n\n';
          
          if (rec.documents_required) {
            textToCopy += 'The documents required for application are usually as follows!\n';
            Object.entries(rec.documents_required).forEach(([key, value]) => {
              textToCopy += `• ${value}\n`;
            });
            textToCopy += '\n';
          }
          
          if (rec.contact_info) {
            textToCopy += 'Contact Information:\n';
            if (rec.contact_info.phone) textToCopy += `Phone: ${rec.contact_info.phone}\n`;
            if (rec.contact_info.website) textToCopy += `Website: ${rec.contact_info.website}\n`;
          }
        }
      } else {
        textToCopy = searchResult;
      }
      
      await navigator.clipboard.writeText(textToCopy);
      // You might want to show a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerateAnswer && currentQuery) {
      onRegenerateAnswer(currentQuery);
    }
  };
  
  if (!isStructuredResult) {
    // Fallback for plain text responses
    return (
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, wordBreak: 'break-word' }}>
        {searchResult}
      </Typography>
    );
  }

  const { answer } = searchResult;
  const recommendation = answer.recommendations?.[0]; // Get first recommendation for details

  return (
    <Box>
      {/* Main Answer - Conversational Style */}
      {answer.general_answer && (
        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
          {answer.general_answer} 😊
        </Typography>
      )}

      {/* Simple list format for main points */}
      {recommendation && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
            There are two main ways to extend an ARC!
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
            <strong>1. Application in person</strong>: You can apply in person at the relevant local immigration office, such as the Sejong-ro Immigration Office. 📍
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
            <strong>2. Apply Online</strong>: You can also apply for an extension online! 🌐
          </Typography>

          <Box sx={{ ml: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5, lineHeight: 1.6 }}>
              • However, online applications are only possible if your Korean residence record is confirmed. 📋
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5, lineHeight: 1.6 }}>
              • If your residence record is not confirmed, you cannot apply online and must visit the immigration office in person. 🏢
            </Typography>
          </Box>
        </Box>
      )}

      {/* Documents section in conversational style */}
      {recommendation?.documents_required && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, lineHeight: 1.6 }}>
            The documents required for application are usually as follows!
          </Typography>
          <Box component="ul" sx={{ ml: 2, mb: 0 }}>
            {Object.entries(recommendation.documents_required).map(([key, value]) => (
              <Typography component="li" variant="body2" key={key} sx={{ mb: 0.3, lineHeight: 1.6 }}>
                {value}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Contact info in simple format */}
      {recommendation?.contact_info && (
        <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            📞 Contact Information:
          </Typography>
          {recommendation.contact_info.phone && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Phone: {recommendation.contact_info.phone}
            </Typography>
          )}
          {recommendation.contact_info.website && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Website: <Link href={recommendation.contact_info.website} target="_blank" rel="noopener noreferrer">
                {recommendation.contact_info.website}
              </Link>
            </Typography>
          )}
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Follow-up Questions */}
      {answer.followup_questions && (
        <FollowUpQuestions 
          questions={answer.followup_questions} 
          onQuestionClick={onFollowUpClick}
        />
      )}

      {/* Sources and Action Buttons Row */}
      {answer.sources && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Sources 
            sources={answer.sources} 
            onSourcesClick={() => handleSourcesPanelToggle(true)}
          />
          
          <Tooltip title="Copy answer">
            <IconButton 
              size="small" 
              onClick={handleCopyAnswer} 
              sx={{ 
                color: '#666',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <ContentCopy sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Regenerate answer">
            <IconButton 
              size="small" 
              onClick={handleRegenerate} 
              sx={{ 
                color: '#666',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <Refresh sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Typography variant="caption" sx={{ color: '#666', ml: 1 }}>
            • {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit',
              minute: '2-digit',
              hour12: true 
            })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SearchResultTemplate;