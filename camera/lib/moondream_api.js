import { File } from 'expo-file-system';

// Moondream API Configuration
export const MOONDREAM_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_MOONDREAM_API_KEY,
  API_URL: 'https://api.moondream.ai/v1/caption',
  DEFAULT_CAPTION_LENGTH: 'normal', // 'short', 'normal', 'long'
  DEFAULT_STREAM: false,
};

/**
 * Calls Moondream API to get image caption
 */
export async function caption_image(
	imageUri, 
	length = MOONDREAM_CONFIG.DEFAULT_CAPTION_LENGTH, 
	stream = MOONDREAM_CONFIG.DEFAULT_STREAM
) {
  try {    
    const base64Image = await uriToBase64(imageUri);
    
    const payload = {
      image_url: `data:image/jpeg;base64,${base64Image}`,
      length: length,
      stream: stream
    };
    
    // Make the API call
    const response = await fetch(MOONDREAM_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Moondream-Auth': MOONDREAM_CONFIG.API_KEY
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }
    
    const result = await response.json();

    console.log('API Response:', result);

    return result.caption;
    
  } catch (error) {
    throw error;
  }
}

/**
 * Converts an image URI to base64 format
 */
async function uriToBase64(uri) {
  try {
    if (uri.startsWith('file://')) {
      const imgFile = new File(uri)
      const base64 = await imgFile.base64()
      return base64;
    } else {
      console.warn('Remote image URLs are not yet supported for base64 conversion');
      return '';
    }
  } catch (error) {
    console.error('Error converting URI to base64:', error);
    throw error;
  }
}
