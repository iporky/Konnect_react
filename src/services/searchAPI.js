/**
 * Search API service for handling streaming search requests
 */

const SEARCH_API_URL = `${process.env.REACT_APP_API_BASE_URL}/konnect/search`;

/**
 * Creates an abort controller for search requests
 * @returns {AbortController} New abort controller
 */
export const createSearchAbortController = () => {
  return new AbortController();
};

/**
 * Performs a streaming search request
 * @param {string} prompt - The search query
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @param {Function} onChunk - Callback for handling streaming chunks
 * @param {Function} onComplete - Callback for completion
 * @param {Function} onError - Callback for errors
 */
export const performStreamingSearch = async (prompt, signal, onChunk, onComplete, onError) => {
  try {
    // Call the streaming API
    const response = await fetch(SEARCH_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchQuestion: prompt
      }),
      signal: signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is streaming
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let chunks = new Map(); // Store chunks by chunk_id
    let isComplete = false;
    
    // Structure to build the response
    let responseStructure = {
      searchQuestion: prompt,
      answer: {
        general_answer: '',
        recommendations: [],
        followup_questions: [],
        sources: []
      }
    };
    
    // Store chunks for progressive rendering
    let currentChunks = {};

    // Read the stream
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      // Decode the chunk
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      // Since API sends complete JSON objects, try to parse each complete object
      // Split on newlines or look for complete JSON objects
      const jsonStrings = [];
      let startIndex = 0;
      
      // Look for complete JSON objects in the buffer
      while (startIndex < buffer.length) {
        let braceCount = 0;
        let inString = false;
        let escapeNext = false;
        let jsonStart = -1;
        
        for (let i = startIndex; i < buffer.length; i++) {
          const char = buffer[i];
          
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            continue;
          }
          
          if (char === '"') {
            inString = !inString;
            continue;
          }
          
          if (!inString) {
            if (char === '{') {
              if (braceCount === 0) {
                jsonStart = i;
              }
              braceCount++;
            } else if (char === '}') {
              braceCount--;
              if (braceCount === 0 && jsonStart !== -1) {
                // Found complete JSON object
                const jsonStr = buffer.substring(jsonStart, i + 1);
                jsonStrings.push(jsonStr);
                startIndex = i + 1;
                break;
              }
            }
          }
        }
        
        // If we didn't find a complete JSON object, break and wait for more data
        if (braceCount > 0 || jsonStart === -1) {
          // Keep the remaining incomplete data in buffer
          buffer = buffer.substring(startIndex);
          break;
        }
      }
      
      console.log('Found complete JSON objects:', jsonStrings.length);
      
      for (const jsonStr of jsonStrings) {
        const trimmedJson = jsonStr.trim();
        if (!trimmedJson) continue;
        
        try {
          let jsonData;
          
          // Check if it's Server-Sent Events format
          if (trimmedJson.startsWith('data: ')) {
            const jsonStr = trimmedJson.substring(6);
            if (jsonStr === '[DONE]') break;
            jsonData = JSON.parse(jsonStr);
          } else {
            // Direct JSON streaming
            jsonData = JSON.parse(trimmedJson);
          }
          
          // Handle chunked streaming response format
          if (jsonData.request_id && jsonData.chunk_id !== undefined) {
            // Store this chunk
            chunks.set(jsonData.chunk_id, jsonData);
            
            // Process the chunk based on ui_element type
            const { ui_element, content } = jsonData;
            
            console.log('Processing chunk:', { chunk_id: jsonData.chunk_id, ui_element, content });
            
            // Store chunk for progressive rendering
            if (ui_element === 'general_answer') {
              currentChunks.general_answer = content;
              responseStructure.answer.general_answer = content;
            } else if (ui_element && ui_element.startsWith('recommendation_')) {
              currentChunks[ui_element] = content;
              const index = parseInt(ui_element.split('_')[1]);
              responseStructure.answer.recommendations[index] = content;
            } else if (ui_element === 'followup_questions') {
              currentChunks.followup_questions = Array.isArray(content) ? content : [content];
              responseStructure.answer.followup_questions = Array.isArray(content) ? content : [content];
            } else if (ui_element === 'sources') {
              currentChunks.sources = Array.isArray(content) ? content : [content];
              responseStructure.answer.sources = Array.isArray(content) ? content : [content];
            } else if (ui_element === 'is_last' && content === 'true') {
              isComplete = true;
            }
            
            console.log('Current chunks:', currentChunks);
            console.log('Is complete:', isComplete);
            
            // Call the chunk handler
            onChunk({
              chunks: { ...currentChunks },
              responseStructure: responseStructure,
              isComplete: isComplete
            });
            
            // If we received the final chunk, we're done
            if (isComplete) {
              break;
            }
          } else {
            // Handle other response formats (fallback)
            onChunk({
              chunks: currentChunks,
              responseStructure: typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData),
              isComplete: true
            });
            break;
          }
          
        } catch (parseError) {
          console.warn('Failed to parse JSON chunk:', trimmedJson, parseError);
        }
      }
      
      // If we're complete, break out of the main loop
      if (isComplete) {
        break;
      }
      
      // Optional: Add a small delay to prevent UI blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Handle any remaining buffer content
    if (buffer.trim()) {
      try {
        const finalData = JSON.parse(buffer.trim());
        if (finalData.request_id && finalData.chunk_id !== undefined) {
          // Handle final chunk
          chunks.set(finalData.chunk_id, finalData);
          
          const { ui_element, content } = finalData;
          
          if (ui_element === 'general_answer') {
            currentChunks.general_answer = content;
            responseStructure.answer.general_answer = content;
          } else if (ui_element && ui_element.startsWith('recommendation_')) {
            currentChunks[ui_element] = content;
            const index = parseInt(ui_element.split('_')[1]);
            responseStructure.answer.recommendations[index] = content;
          } else if (ui_element === 'followup_questions') {
            currentChunks.followup_questions = Array.isArray(content) ? content : [content];
            responseStructure.answer.followup_questions = Array.isArray(content) ? content : [content];
          } else if (ui_element === 'sources') {
            currentChunks.sources = Array.isArray(content) ? content : [content];
            responseStructure.answer.sources = Array.isArray(content) ? content : [content];
          } else if (ui_element === 'is_last' && content === 'true') {
            isComplete = true;
          }
          
          onChunk({
            chunks: { ...currentChunks },
            responseStructure: responseStructure,
            isComplete: true
          });
        } else {
          // Handle as regular response
          onChunk({
            chunks: currentChunks,
            responseStructure: typeof finalData === 'string' ? finalData : JSON.stringify(finalData),
            isComplete: true
          });
        }
      } catch (parseError) {
        console.warn('Failed to parse final buffer:', buffer, parseError);
      }
    }
    
    // If we haven't set a final response yet, finalize with what we have
    if (!isComplete) {
      console.log('Stream ended without is_last marker, finalizing response');
      onChunk({
        chunks: { ...currentChunks },
        responseStructure: responseStructure,
        isComplete: true
      });
    }
    
    // Call completion handler
    onComplete();
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Search request was aborted');
      return;
    }
    
    console.error('Streaming API error:', error);
    onError(error);
  }
};