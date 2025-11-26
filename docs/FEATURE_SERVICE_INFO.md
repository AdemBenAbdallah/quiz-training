# Service Info Feature Documentation

## Overview

The Service Info feature provides users with quick access to comprehensive information about AWS services mentioned in quiz questions. When users click the service info button (BadgeInfo icon), a modal opens displaying detailed information about the primary AWS service discussed in the current question.

## How It Works

### User Experience
1. **Discovery**: Next to the quiz title, users will see a blue info button with "Service Info" label
2. **Interaction**: Clicking the button opens a modal dialog
3. **Content**: The modal displays:
   - Service name and description
   - Key features of the service
   - Common use cases
   - Related AWS services

### Technical Implementation

#### Components
- **ServiceInfoDialog.tsx**: Main modal component that handles the UI and API calls
- **API Route**: `/api/service-info` - Processes requests and returns structured service information
- **Schema Validation**: Ensures AI responses match expected format
- **Caching**: Redis-based caching for improved performance

#### API Endpoint
```
POST /api/service-info
Content-Type: application/json

{
  "question": "string",
  "options": ["string", "string", ...]
}
```

**Response Format:**
```json
{
  "serviceName": "string",
  "serviceDescription": "string", 
  "keyFeatures": ["string", "string", ...],
  "useCases": ["string", "string", ...],
  "relatedServices": ["string", "string", ...]
}
```

#### Caching Strategy
- **Cache Key**: Generated from question and options content hash
- **Expiration**: 30 days
- **Fallback**: If cache fails, API continues to work without caching
- **Performance**: Cached responses return instantly with visual indicator

#### AI Integration
- **Model**: Google Gemini 1.5 Pro Latest
- **Prompt Engineering**: Specialized prompt to identify primary AWS service and extract comprehensive information
- **Response Processing**: JSON parsing with code block stripping and schema validation

## Features

### Loading States
- **Initial**: Clean interface before user interaction
- **Loading**: Spinner with progress message
- **Cached**: Green indicator for cached responses
- **Generated**: Blue indicator for newly generated responses
- **Error**: Red error message with retry capability

### Accessibility
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support with Enter/Space activation
- **Focus Management**: Clear focus indicators and ring styling
- **Semantic HTML**: Proper heading hierarchy and structure

### Visual Design
- **Consistent Styling**: Matches existing modal design patterns
- **Responsive**: Works on all screen sizes
- **Loading Skeletons**: Smooth loading experience with animated placeholders
- **Color Coding**: Visual indicators for different content types
- **Interactive Elements**: Hover effects and smooth transitions

## Usage Examples

### Basic Usage in Quiz Component
```tsx
import ServiceInfoDialog from "./ServiceInfoDialog";

<ServiceInfoDialog question={currentQuestion}>
  <button
    type="button"
    aria-label="Learn about the AWS service in this question"
    className="service-info-button"
  >
    <BadgeInfo className="w-5 h-5" />
  </button>
</ServiceInfoDialog>
```

### Custom Trigger
```tsx
<ServiceInfoDialog question={question}>
  <Button variant="outline">
    Service Details
  </Button>
</ServiceInfoDialog>
```

## Implementation Details

### File Structure
```
components/
├── ServiceInfoDialog.tsx          # Main component
└── ui/
    ├── dialog.tsx                # Base dialog components
    └── button.tsx                # Button components

app/api/service-info/
├── route.ts                      # API endpoint
└── schemas.ts                    # Zod validation schemas

lib/
└── redis-cache.ts               # Caching utilities
```

### Dependencies
- **@ai-sdk/google**: Gemini AI integration
- **zod**: Schema validation
- **lucide-react**: Icons
- **framer-motion**: Animations (inherited from dialog)
- **redis**: Caching layer

### Error Handling
- **Network Errors**: Graceful degradation with error messages
- **AI Response Errors**: Schema validation with fallback
- **Cache Errors**: Continues without caching if Redis fails
- **Rate Limiting**: Built-in through AI SDK

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Modal content only loads when opened
- **Debounced Requests**: Prevents duplicate requests
- **Response Caching**: 30-day cache reduces API calls
- **Skeleton Loading**: Perceived performance improvement
- **Error Boundaries**: Prevents crashes from affecting main quiz

### Monitoring
- **Console Logging**: Tracks cache hits/misses and generation
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Loading time indicators

## Future Enhancements

### Potential Features
- **Service Documentation Links**: Direct links to AWS documentation
- **Interactive Tutorials**: Step-by-step service guides
- **Comparison Mode**: Side-by-side service comparisons
- **Bookmarking**: Save favorite service information
- **Offline Support**: Cache service information locally

### Integration Opportunities
- **Quiz Analytics**: Track which services users research most
- **Learning Paths**: Suggest related learning materials
- **Progress Tracking**: Monitor service knowledge improvement
- **Adaptive Content**: Personalized service recommendations

## Troubleshooting

### Common Issues
1. **Modal Not Opening**: Check if question prop is properly passed
2. **Loading Indefinitely**: Verify API endpoint and Gemini configuration
3. **Cache Issues**: Redis connection problems - check connection logs
4. **Styling Problems**: Ensure Tailwind classes are properly compiled

### Debug Steps
1. Check browser console for error messages
2. Verify API endpoint is accessible via network tab
3. Test Redis connection in development environment
4. Validate question data structure matches expected format

## Security Considerations

- **Input Sanitization**: Question content is validated before processing
- **API Rate Limiting**: Protected through AI SDK built-in limits
- **Cache Security**: Redis keys are hashed to prevent data leakage
- **Error Information**: Error messages don't expose sensitive data