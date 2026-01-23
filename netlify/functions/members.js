import '../_shared/env-loader.js'; // Load .env in local dev
import { getMembers, getMemberByEmail, createMember, initializeDatabase } from './utils/database.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Best practice: Check if database is configured with validation
  if (!process.env.FAUNA_SECRET_KEY) {
    console.error('[MEMBERS] FAUNA_SECRET_KEY not configured');
    return errorResponse(
      'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables.',
      503
    );
  }
  
  // Best practice: Validate key format
  const key = process.env.FAUNA_SECRET_KEY;
  if (!key.startsWith('fn') || key.length < 40) {
    console.error('[MEMBERS] FAUNA_SECRET_KEY appears invalid');
    return errorResponse(
      'Invalid FAUNA_SECRET_KEY format. Get your key from https://dashboard.fauna.com/',
      503
    );
  }

  // Initialize database (non-blocking, cached)
  initializeDatabase().catch(err => {
    console.error('[MEMBERS] Database initialization error (non-blocking):', err.message);
  });

  try {
    if (event.httpMethod === 'GET') {
      const members = await getMembers();
      
      // Remove passwords from response
      const safeMembers = members.map(({ password, ...member }) => member);
      
      return successResponse({ members: safeMembers }, 'Members retrieved successfully');
    }

    if (event.httpMethod === 'POST') {
      let body;
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch (parseError) {
        return errorResponse('Invalid JSON in request body', 400);
      }

      const { name, email, password, phone } = body;

      // Validation
      if (!name || !email || !password) {
        return errorResponse('Name, email, and password are required', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new member
      const memberData = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
      };

      // Best practice: Retry logic for database operations
      let newMember;
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          newMember = await createMember(memberData);
          break; // Success, exit retry loop
        } catch (dbError) {
          retries++;
          
          // Best practice: Don't retry on validation errors
          if (dbError.message && dbError.message.includes('already registered')) {
            return errorResponse('Email already registered', 400);
          }
          
          // Best practice: Retry on transient errors
          if (retries < maxRetries) {
            const delay = 1000 * retries; // Exponential backoff
            console.log(`[MEMBERS] Retry ${retries}/${maxRetries} after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            // All retries exhausted
            console.error('[MEMBERS] Database error creating member after retries:', dbError);
            return errorResponse('Failed to save member. Please try again.', 500);
          }
        }
      }
      
      // Remove password from response
      const { password: _, ...safeMember } = newMember;

      return successResponse(
        { member: safeMember },
        'Member registered successfully',
        201
      );
    }

    return handleMethodNotAllowed(['GET', 'POST']);
  } catch (error) {
    console.error('[MEMBERS ERROR]', error);
    return errorResponse('Internal server error', 500, error);
  }
};
