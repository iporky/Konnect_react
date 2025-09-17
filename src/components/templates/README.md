# Search Result Templates

This folder contains modular template components for displaying structured search results in the chat interface.

## Components

### Individual Templates
- **FollowUpQuestions.js** - Displays clickable follow-up questions with icons
- **Sources.js** - Shows source links with external link indicators
- **Amenities.js** - Displays amenities as chips with appropriate icons
- **Recommendations.js** - Complex card layout for business/service recommendations
- **DocumentsRequired.js** - Lists required documents with visual emphasis
- **BookingInfo.js** - Shows booking links and contact information

### Main Template
- **SearchResultTemplate.js** - Orchestrates all individual templates and handles both structured JSON responses and plain text fallback

## Usage

The templates automatically detect structured JSON responses from the AI service and render appropriate UI elements. For plain text responses, they fall back to simple text display.

```javascript
import SearchResultTemplate from '../components/templates/SearchResultTemplate';

<SearchResultTemplate 
  searchResult={parsedResponse} 
  onFollowUpClick={handleFollowUpClick}
/>
```

## Expected Data Structure

The templates expect search results in this format:

```json
{
  "searchQuestion": "string",
  "answer": {
    "general_answer": "string",
    "recommendations": [...],
    "followup_questions": [...],
    "sources": [...]
  }
}
```

Each template gracefully handles missing data and only renders when relevant data is present.