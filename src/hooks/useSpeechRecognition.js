import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for speech recognition functionality
 * @param {Object} options - Configuration options
 * @param {number} options.pauseTimeout - Time in milliseconds to wait before stopping (default: 3000)
 * @param {string} options.language - Speech recognition language (default: 'en-US')
 * @param {boolean} options.continuous - Whether to use continuous recognition (default: true)
 * @param {boolean} options.interimResults - Whether to return interim results (default: true)
 * @returns {Object} Speech recognition state and controls
 */
const useSpeechRecognition = (options = {}) => {
  const {
    pauseTimeout = 3000,
    language = 'en-US',
    continuous = true,
    interimResults = true
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);

  const speechTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);

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
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onresult = (event) => {
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
        
        // Update transcripts
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          setInterimTranscript(''); // Clear interim when we get final
        } else {
          setInterimTranscript(currentInterimTranscript);
        }
        
        // Reset the pause timeout on each speech result
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }
        
        speechTimeoutRef.current = setTimeout(() => {
          if (recognition && isListening) {
            recognition.stop();
          }
        }, pauseTimeout);
      };
      
      recognition.onerror = (event) => {
        handleSpeechError(event.error);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current);
        }
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
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, continuous, interimResults, pauseTimeout, handleSpeechError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
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
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
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
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    
    // Actions
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    clearError,
    
    // Utility
    hasTranscript: transcript.length > 0,
    fullTranscript: transcript + interimTranscript
  };
};

export default useSpeechRecognition;