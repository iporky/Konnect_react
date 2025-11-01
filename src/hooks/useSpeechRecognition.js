import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook for speech recognition functionality with dynamic language support
 * @param {Object} options - Configuration options
 * @param {string} options.language - Speech recognition language (default: 'en-US')
 * @param {boolean} options.continuous - Whether to use continuous recognition (default: false)
 * @param {boolean} options.interimResults - Whether to return interim results (default: true)
 * @param {Function} options.onTranscriptComplete - Optional callback when transcript is complete (not used for auto-submit)
 * @returns {Object} Speech recognition state and controls
 */
const useSpeechRecognition = (options = {}) => {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    onTranscriptComplete
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const recognitionRef = useRef(null);
  const currentTranscriptRef = useRef('');
  const currentInterimRef = useRef('');
  const hasCalledCompleteRef = useRef(false); // Prevent duplicate calls

  // Handle speech recognition errors with user-friendly messages
  const handleSpeechError = useCallback((errorCode) => {
    setIsListening(false);
    let message = 'Speech recognition error: ';
    
    switch (errorCode) {
      case 'not-allowed':
        message += 'Microphone access denied. Please enable microphone permissions and try again.';
        break;
      case 'no-speech':
        message += 'No speech was detected. Please try again.';
        break;
      case 'audio-capture':
        message += 'No microphone was found. Please check your microphone connection.';
        break;
      case 'network':
        message += 'Network error occurred. Please check your internet connection.';
        break;
      case 'service-not-allowed':
        message += 'Speech recognition service is not allowed. Please check your browser settings.';
        break;
      case 'bad-grammar':
        message += 'Speech recognition grammar error.';
        break;
      default:
        message += 'Please try again or use text input.';
    }
    
    setError({ code: errorCode, message });
    console.warn(message);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    // Initialize refs
    currentTranscriptRef.current = '';
    currentInterimRef.current = '';
    hasCalledCompleteRef.current = false; // Reset on initialization
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = 1;
      
      // Update current language state
      setCurrentLanguage(language);
      
      // Optimize for faster response
      if ('webkitSpeechRecognition' in window) {
        recognition.webkitServiceURI = 'wss://www.google.com/speech-api/v2/recognize';
      }
      
      recognition.onstart = () => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🎤 [${timestamp}] Speech recognition started for language: ${language}`);
        hasCalledCompleteRef.current = false; // Reset flag on start
        setIsListening(true);
        setError(null);
      };
      
      recognition.onresult = (event) => {
        console.log('🗣️ Speech recognition result received');
        let finalTranscript = '';
        let currentInterimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText;
          } else {
            currentInterimTranscript += transcriptText;
          }
        }
        
        console.log('📝 Final:', finalTranscript, '| Interim:', currentInterimTranscript);
        
        // Immediately update transcripts for real-time feedback
        if (finalTranscript) {
          setTranscript(prev => {
            const newTranscript = prev + finalTranscript;
            currentTranscriptRef.current = newTranscript;
            return newTranscript;
          });
          setInterimTranscript(''); // Clear interim when we get final
          currentInterimRef.current = '';
        }
        
        // Update interim results immediately for visual feedback
        if (currentInterimTranscript) {
          setInterimTranscript(currentInterimTranscript);
          currentInterimRef.current = currentInterimTranscript;
        }
      };
      
      recognition.onerror = (event) => {
        handleSpeechError(event.error);
      };
      
      recognition.onend = () => {
        const finalTranscript = currentTranscriptRef.current + currentInterimRef.current;
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🏁 [${timestamp}] Speech recognition ended naturally with transcript:`, finalTranscript);
        setIsListening(false);
        setInterimTranscript(''); // Only clear interim
        currentInterimRef.current = '';
        
        // Don't auto-submit - just keep the text in the search bar
        // The onTranscriptComplete callback can still be used for other purposes if needed
        // but we won't call it automatically anymore
        console.log(`� [${timestamp}] Speech recognition complete - text preserved in search bar`);
        // Note: Keep the transcript - don't clear it
      };
      
      setSpeechRecognition(recognition);
      recognitionRef.current = recognition;
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError({
        code: 'not-supported',
        message: 'Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.'
      });
    }
    
    return () => {
      // Cleanup function - no timeouts to clear anymore
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, continuous, interimResults, handleSpeechError, onTranscriptComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []); // Empty dependency array for cleanup on unmount only

  // Start speech recognition
  const startListening = useCallback(() => {
    if (!speechRecognition || !isSupported) {
      handleSpeechError('not-supported');
      return false;
    }

    if (isListening) {
      return true; // Already listening
    }

    try {
      setError(null);
      speechRecognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      handleSpeechError('start-failed');
      return false;
    }
  }, [speechRecognition, isSupported, isListening, handleSpeechError]);

  // Stop speech recognition
  const stopListening = useCallback(() => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
    }
  }, [speechRecognition, isListening]);

  // Toggle speech recognition
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    currentTranscriptRef.current = '';
    currentInterimRef.current = '';
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sync transcript with external value (useful when user manually edits search)
  // This ensures that when a user deletes text from search box, the speech recognition
  // state is updated to match, preventing appending to deleted text on next speech input
  const syncTranscript = useCallback((newValue) => {
    setTranscript(newValue || '');
    setInterimTranscript('');
    currentTranscriptRef.current = newValue || '';
    currentInterimRef.current = '';
    console.log(`🔄 Speech transcript synced with external value: "${newValue}"`);
  }, []);

  // Change language dynamically
  const changeLanguage = useCallback((newLanguage) => {
    console.log(`🌍 Changing speech recognition language to: ${newLanguage}`);
    
    // Stop current recognition if running
    if (isListening && speechRecognition) {
      speechRecognition.stop();
    }
    
    // Update the language for the current recognition instance
    if (speechRecognition) {
      speechRecognition.lang = newLanguage;
      setCurrentLanguage(newLanguage);
      console.log(`✅ Language updated to: ${newLanguage}`);
    }
  }, [speechRecognition, isListening]);

  return {
    // State
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    currentLanguage,
    
    // Actions
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    clearError,
    syncTranscript,
    changeLanguage,
    
    // Utility
    hasTranscript: transcript.length > 0,
    fullTranscript: transcript + interimTranscript
  };
};

export default useSpeechRecognition;