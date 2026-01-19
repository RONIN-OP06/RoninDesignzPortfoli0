import { readData, writeData } from './utils/db.js';

const ADMIN_EMAILS = ['ronindesignz123@gmail.com', 'roninsyoutub123@gmail.com'].map(e => e.toLowerCase().trim());

function isAdmin(authHeader) {
  // Simple auth check - in production, use proper JWT tokens
  if (!authHeader) return false;
  
  try {
    const token = authHeader.replace('Bearer ', '');
    // For now, we'll check if the user ID matches an admin email
    // In production, decode JWT and verify
    return true; // Simplified for now
  } catch {
    return false;
  }
}

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
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

    if (event.httpMethod === 'GET') {
      const messages = readData('messages.json', []);
      
      // Sort by createdAt, newest first
      const sortedMessages = messages.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          messages: sortedMessages,
        }),
      };
    }

    if (event.httpMethod === 'PUT') {
      const { id, read } = JSON.parse(event.body || '{}');
      
      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Message ID is required',
          }),
        };
      }

      const messages = readData('messages.json', []);
      const messageIndex = messages.findIndex(m => m.id === id);

      if (messageIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Message not found',
          }),
        };
      }

      if (read !== undefined) {
        messages[messageIndex].read = read;
      }

      writeData('messages.json', messages);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Message updated',
          data: messages[messageIndex],
        }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed',
      }),
    };
  } catch (error) {
    console.error('Error in messages function:', error);
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
