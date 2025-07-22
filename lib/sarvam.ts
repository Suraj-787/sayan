// Get your Sarvam AI API subscription key here: https://dashboard.sarvam.ai/admin

// API key from environment variable
const SARVAM_API_KEY = process.env.NEXT_PUBLIC_SARVAM_API_KEY;

const baseUrl = 'https://api.sarvam.ai';

/**
 * Converts speech to text using Sarvam API
 * @param audioBlob - Audio blob from microphone recording
 * @param languageCode - Language code (e.g., 'hi-IN', 'en-IN')
 * @returns Transcribed text
 */
export async function speechToText(audioBlob: Blob, languageCode: string = 'hi-IN'): Promise<string> {
  if (!SARVAM_API_KEY) {
    throw new Error('Sarvam API key is missing. Please set the NEXT_PUBLIC_SARVAM_API_KEY environment variable.');
  }

  try {
    console.log(`[Sarvam] Processing speech with language: ${languageCode}, blob size: ${audioBlob.size} bytes`);
    
    // Use browser's native FormData for browser environments
    const formData = new window.FormData();
    
    // Append the blob directly - browser FormData handles this properly
    formData.append('file', audioBlob, 'recording.webm');
    
    // Map any language code to Sarvam's expected format
    const sarvamLanguage = languageCode.split('-')[0] || 'hi';
    
    formData.append('language_code', sarvamLanguage);
    formData.append('model', 'saarika:v2');
    formData.append('with_timestamps', 'false');

    console.log(`[Sarvam] Sending request with language: ${sarvamLanguage}`);
    
    const response = await fetch(`${baseUrl}/speech-to-text`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api-subscription-key': SARVAM_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Sarvam] Error response: ${errorText}`);
      throw new Error(`Speech-to-text request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[Sarvam] Successfully received response:`, data);
    return data.text || '';
  } catch (error) {
    console.error('[Sarvam] Error in speech-to-text:', error);
    throw error;
  }
}

/**
 * Converts text to speech using Sarvam API
 * @param text - Text to convert to speech
 * @param languageCode - Target language code (e.g., 'hi-IN', 'ta-IN')
 * @returns Audio blob URL
 */
export async function textToSpeech(text: string, languageCode: string = 'hi-IN'): Promise<string> {
  if (!SARVAM_API_KEY) {
    throw new Error('Sarvam API key is missing. Please set the NEXT_PUBLIC_SARVAM_API_KEY environment variable.');
  }

  try {
    console.log(`[Sarvam] Converting text to speech in language: ${languageCode}`);
    
    // Select appropriate speaker based on language
    const speaker = languageCode.startsWith('hi') ? 'meera' : 
                    languageCode.startsWith('ta') ? 'pavithra' :
                    languageCode.startsWith('bn') ? 'geet' : 'pavithra';
    
    const response = await fetch(`${baseUrl}/text-to-speech`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: languageCode.split('-')[0] || languageCode,
        speaker,
        pitch: 0,
        pace: 1.0,
        loudness: 1.2,
        speech_sample_rate: 16000,
        enable_preprocessing: true,
        model: 'bulbul:v1'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Sarvam] Error in text-to-speech:`, errorText);
      throw new Error(`Text-to-speech request failed: ${response.status} ${response.statusText}`);
    }

    // The response contains audio data which we convert to a blob URL
    const audioData = await response.arrayBuffer();
    const audioBlob = new Blob([audioData], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log(`[Sarvam] Successfully created audio URL:`, audioUrl);
    
    return audioUrl;
  } catch (error) {
    console.error('[Sarvam] Error in text-to-speech:', error);
    throw error;
  }
}

/**
 * Detects language from speech using Sarvam API
 * @param audioBlob - Audio blob from microphone recording
 * @returns Detected language code
 */
export async function detectLanguageFromSpeech(audioBlob: Blob): Promise<string> {
  if (!SARVAM_API_KEY) {
    throw new Error('Sarvam API key is missing. Please set the NEXT_PUBLIC_SARVAM_API_KEY environment variable.');
  }

  try {
    console.log(`[Sarvam] Detecting language from speech, blob size: ${audioBlob.size} bytes`);
    
    // Use browser's native FormData
    const formData = new window.FormData();
    
    // Append the blob directly
    formData.append('prompt', audioBlob, 'recording.webm');
    formData.append('model', 'saaras:v1');

    const response = await fetch(`${baseUrl}/speech-to-text-translate`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api-subscription-key': SARVAM_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Sarvam] Error detecting language:`, errorText);
      throw new Error(`Language detection request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[Sarvam] Detected language:`, data);
    return data.language_code || 'en-IN'; // Default to English if detection fails
  } catch (error) {
    console.error('[Sarvam] Error in language detection:', error);
    throw error;
  }
} 