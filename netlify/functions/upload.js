import '../_shared/env-loader.js'; // Load .env in local dev
import { getMemberById } from './utils/database.js';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

// Simple ID generator (no need for db.js dependency)
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const ADMIN_EMAILS = ['ronindesignz123@gmail.com', 'roninsyoutub123@gmail.com'].map(e => e.toLowerCase().trim());

async function isAdmin(authHeader) {
  if (!authHeader) return false;
  try {
    const token = authHeader.replace('Bearer ', '');
    if (!token) return false;
    
    const member = await getMemberById(token);
    if (!member) return false;
    
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

  if (event.httpMethod !== 'POST') {
    return handleMethodNotAllowed(['POST']);
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    const adminCheck = await isAdmin(authHeader);
    if (!adminCheck) {
      return errorResponse('Unauthorized - Admin access required', 401);
    }

    // For file uploads, Netlify Functions receive base64 encoded data
    // In production, you might want to use Netlify's built-in file handling
    // or integrate with a service like Cloudinary, AWS S3, etc.
    
    let body;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      return errorResponse('Invalid JSON in request body', 400);
    }

    const { file, category } = body;

    if (!file || !category) {
      return errorResponse('File and category are required', 400);
    }

    // For now, return a placeholder URL
    // In production, upload to a storage service and return the URL
    const fileUrl = `/uploads/${generateId()}-${Date.now()}`;

    return successResponse({ url: fileUrl }, 'File uploaded successfully');
  } catch (error) {
    console.error('Error in upload function:', error);
    return errorResponse('Internal server error', 500, error);
  }
};
