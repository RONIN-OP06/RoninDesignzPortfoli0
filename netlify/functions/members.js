import { getMembers, getMemberByEmail, createMember, initializeDatabase } from './utils/database.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Check if database is configured
  if (!process.env.FAUNA_SECRET_KEY) {
    console.error('[MEMBERS] FAUNA_SECRET_KEY not configured');
    return errorResponse(
      'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables.',
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

      try {
        const newMember = await createMember(memberData);
        
        // Remove password from response
        const { password: _, ...safeMember } = newMember;

        return successResponse(
          { member: safeMember },
          'Member registered successfully',
          201
        );
      } catch (dbError) {
        if (dbError.message && dbError.message.includes('already registered')) {
          return errorResponse('Email already registered', 400);
        }
        
        console.error('[MEMBERS] Database error creating member:', dbError);
        return errorResponse('Failed to save member. Please try again.', 500);
      }
    }

    return handleMethodNotAllowed(['GET', 'POST']);
  } catch (error) {
    console.error('[MEMBERS ERROR]', error);
    return errorResponse('Internal server error', 500, error);
  }
};
