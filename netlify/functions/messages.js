import '../_shared/env-loader.js'; // Load .env in local dev
import { getMessages, getMessageById, updateMessage, initializeDatabase, getMemberById } from './utils/database.js';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

const ADMIN_EMAILS = ['ronindesignz123@gmail.com', 'roninsyoutub123@gmail.com'].map(e => e.toLowerCase().trim());

async function isAdmin(authHeader) {
  // Check if user is authenticated and is admin
  if (!authHeader) return false;
  
  try {
    const token = authHeader.replace('Bearer ', '');
    if (!token) return false;
    
    // Get user from database by ID (token is user ID for now)
    const member = await getMemberById(token);
    if (!member) return false;
    
    // Check if member email is in admin list
    const memberEmail = member.email?.toLowerCase().trim();
    return ADMIN_EMAILS.includes(memberEmail);
  } catch {
    return false;
  }
}

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Check if database is configured
  if (!process.env.FAUNA_SECRET_KEY) {
    return errorResponse(
      'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables.',
      503
    );
  }

  // Initialize database (non-blocking, cached)
  initializeDatabase().catch(err => {
    console.error('[MESSAGES] Database initialization error (non-blocking):', err.message);
  });

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    const adminCheck = await isAdmin(authHeader);
    if (!adminCheck) {
      return errorResponse('Unauthorized - Admin access required', 401);
    }

    if (event.httpMethod === 'GET') {
      const messages = await getMessages();
      
      // Sort by createdAt, newest first
      const sortedMessages = messages.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      return successResponse({ messages: sortedMessages }, 'Messages retrieved successfully');
    }

    if (event.httpMethod === 'PUT') {
      let body;
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch (parseError) {
        return errorResponse('Invalid JSON in request body', 400);
      }

      const { id, read } = body;
      
      if (!id) {
        return errorResponse('Message ID is required', 400);
      }

      try {
        const existingMessage = await getMessageById(id);
        
        if (!existingMessage) {
          return errorResponse('Message not found', 404);
        }

        const updates = {};
        if (read !== undefined) {
          updates.read = read;
        }

        const updatedMessage = await updateMessage(id, updates);

        return successResponse(updatedMessage, 'Message updated');
      } catch (dbError) {
        console.error('Error updating message:', dbError);
        return errorResponse('Failed to update message', 500);
      }
    }

    return handleMethodNotAllowed(['GET', 'PUT']);
  } catch (error) {
    console.error('Error in messages function:', error);
    return errorResponse('Internal server error', 500, error);
  }
};
