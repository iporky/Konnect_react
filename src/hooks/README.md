# useSpeechRecognition Hook

A custom React hook for handling speech-to-text functionality with automatic pause detection.

## Features

- 🎤 **Speech Recognition**: Web Speech API integration
- ⏸️ **Auto-pause**: Automatically stops listening after configurable silence period
- 🌐 **Browser Support**: Works with Chrome, Edge, Safari, and other WebKit-based browsers
- 🛡️ **Error Handling**: Comprehensive error handling with user-friendly messages
- 🔧 **Configurable**: Customizable language, timeout, and recognition settings
- 📱 **Responsive**: Works on both desktop and mobile devices

## Installation

Place the `useSpeechRecognition.js` file in your `src/hooks/` directory.

## Basic Usage

```jsx
import React, { useState } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

function VoiceInput() {
  const [text, setText] = useState('');
  
  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    error
  } = useSpeechRecognition();

  // Update text when transcript changes
  React.useEffect(() => {
    if (transcript) {
      setText(prev => prev + transcript);
    }
  }, [transcript]);

  if (!isSupported) {
    return <div>Speech recognition is not supported in this browser.</div>;
  }

  return (
    <div>
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Speak or type here..."
      />
      
      <button onClick={toggleListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      
      {error && <div style={{color: 'red'}}>{error.message}</div>}
      {isListening && <div>🎤 Listening... (will stop after 3 seconds of silence)</div>}
    </div>
  );
}
```

## Advanced Usage

```jsx
import useSpeechRecognition from '../hooks/useSpeechRecognition';

function AdvancedVoiceInput() {
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    clearError,
    hasTranscript,
    fullTranscript
  } = useSpeechRecognition({
    pauseTimeout: 5000,    // 5 seconds of silence before stopping
    language: 'ko-KR',     // Korean language
    continuous: true,      // Continuous recognition
    interimResults: true   // Show interim results
  });

  return (
    <div>
      <div>
        Final: {transcript}
        {interimTranscript && <span style={{opacity: 0.5}}>{interimTranscript}</span>}
      </div>
      
      <button onClick={startListening} disabled={isListening}>
        Start
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop
      </button>
      <button onClick={resetTranscript} disabled={!hasTranscript}>
        Clear
      </button>
      
      {error && (
        <div>
          <span style={{color: 'red'}}>{error.message}</span>
          <button onClick={clearError}>✕</button>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### Parameters

```jsx
useSpeechRecognition({
  pauseTimeout: 3000,     // Time in ms before stopping (default: 3000)
  language: 'en-US',      // Recognition language (default: 'en-US')
  continuous: true,       // Continuous recognition (default: true)
  interimResults: true    // Show interim results (default: true)
})
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `isListening` | boolean | Whether speech recognition is active |
| `isSupported` | boolean | Whether speech recognition is supported |
| `transcript` | string | Final transcribed text |
| `interimTranscript` | string | Interim (not yet final) transcribed text |
| `error` | object/null | Error object with `code` and `message` |
| `startListening` | function | Start speech recognition |
| `stopListening` | function | Stop speech recognition |
| `toggleListening` | function | Toggle speech recognition on/off |
| `resetTranscript` | function | Clear all transcripts |
| `clearError` | function | Clear current error |
| `hasTranscript` | boolean | Whether there is any transcript text |
| `fullTranscript` | string | Combined final + interim transcript |

### Error Codes

- `not-supported`: Browser doesn't support speech recognition
- `not-allowed`: Microphone access denied
- `no-speech`: No speech detected
- `audio-capture`: No microphone found
- `network`: Network error
- `service-not-allowed`: Speech service not allowed
- `start-failed`: Failed to start recognition

## Browser Support

- ✅ Chrome (desktop & mobile)
- ✅ Edge (desktop & mobile)  
- ✅ Safari (desktop & mobile)
- ❌ Firefox (limited support)
- ❌ Internet Explorer

## Best Practices

1. **Always check `isSupported`** before showing voice controls
2. **Handle errors gracefully** with user-friendly messages
3. **Provide visual feedback** when listening is active
4. **Combine with text input** as fallback option
5. **Request microphone permissions** early in user flow
6. **Test on target devices** as behavior can vary

## Notes

- Requires HTTPS in production
- May require user interaction before starting (browser security)
- Recognition accuracy varies by language and accent
- Some browsers may have daily usage limits