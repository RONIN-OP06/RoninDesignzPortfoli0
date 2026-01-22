import { getMessages, getMessageById, updateMessage, initializeDatabase } from './utils/database.js';

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

  // Check if database is configured
  if (!process.env.FAUNA_SECRET_KEY) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables.',
      }),
    };
  }

  // Initialize database (non-blocking, cached)
  initializeDatabase().catch(err => {
    console.error('[MESSAGES] Database initialization error (non-blocking):', err.message);
  });

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
      const messages = await getMessages();
      
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

      try {
        const existingMessage = await getMessageById(id);
        
        if (!existingMessage) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Message not found',
            }),
          };
        }

        const updates = {};
        if (read !== undefined) {
          updates.read = read;
        }

        const updatedMessage = await updateMessage(id, updates);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Message updated',
            data: updatedMessage,
          }),
        };
      } catch (dbError) {
        console.error('Error updating message:', dbError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to update message',
          }),
        };
      }
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
