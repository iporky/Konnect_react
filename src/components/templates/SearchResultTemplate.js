import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import FollowUpQuestions from './FollowUpQuestions';
import Sources from './Sources';
import Amenities from './Amenities';
import Recommendations from './Recommendations';
import DocumentsRequired from './DocumentsRequired';
import BookingInfo from './BookingInfo';

const SearchResultTemplate = ({ searchResult, onFollowUpClick }) => {
  // Handle both structured object and plain text responses
  const isStructuredResult = searchResult && typeof searchResult === 'object' && searchResult.answer;
  
  if (!isStructuredResult) {
    // Fallback for plain text responses
    return (
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, wordBreak: 'break-word' }}>
        {searchResult}
      </Typography>
    );
  }

  const { searchQuestion, answer } = searchResult;

  return (
    <Box>
      {/* Question (if different from user input) */}
      {searchQuestion && (
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#3289C9' }}>
          {searchQuestion}
        </Typography>
      )}

      {/* General Answer */}
      {answer.general_answer && (
        <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
          {answer.general_answer}
        </Typography>
      )}

      {/* Recommendations */}
      {answer.recommendations && (
        <Recommendations recommendations={answer.recommendations} />
      )}

      {/* Documents Required (extracted from first recommendation if available) */}
      {answer.recommendations?.[0]?.documents_required && (
        <DocumentsRequired documentsRequired={answer.recommendations[0].documents_required} />
      )}

      {/* Booking Info (extracted from first recommendation if available) */}
      {answer.recommendations?.[0]?.booking_info && (
        <BookingInfo bookingInfo={answer.recommendations[0].booking_info} />
      )}

      {/* Amenities (extracted from first recommendation if available) */}
      {answer.recommendations?.[0]?.amenities && (
        <Amenities amenities={answer.recommendations[0].amenities} />
      )}

      <Divider sx={{ my: 2 }} />

      {/* Follow-up Questions */}
      {answer.followup_questions && (
        <FollowUpQuestions 
          questions={answer.followup_questions} 
          onQuestionClick={onFollowUpClick}
        />
      )}

      {/* Sources */}
      {answer.sources && (
        <Sources sources={answer.sources} />
      )}
    </Box>
  );
};

export default SearchResultTemplate;