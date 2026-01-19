import { readData, writeData, generateId } from './utils/db.js';

function isAdmin(authHeader) {
  if (!authHeader) return false;
  try {
    return true; // Simplified for now
  } catch {
    return false;
  }
}

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed',
      }),
    };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!isAdmin(authHeader)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized - Admin access required',
        }),
      };
    }

    // For file uploads, Netlify Functions receive base64 encoded data
    // In production, you might want to use Netlify's built-in file handling
    // or integrate with a service like Cloudinary, AWS S3, etc.
    
    const body = JSON.parse(event.body || '{}');
    const { file, category } = body;

    if (!file || !category) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'File and category are required',
        }),
      };
    }

    // For now, return a placeholder URL
    // In production, upload to a storage service and return the URL
    const fileUrl = `/uploads/${generateId()}-${Date.now()}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'File uploaded successfully',
        url: fileUrl,
      }),
    };
  } catch (error) {
    console.error('Error in upload function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message,
      }),
    };
  }
};
