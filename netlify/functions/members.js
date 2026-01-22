import { getMembers, getMemberByEmail, createMember, initializeDatabase } from './utils/database.js';
import bcrypt from 'bcryptjs';

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Initialize database (idempotent)
  try {
    await initializeDatabase();
  } catch (initError) {
    console.error('[MEMBERS] Database initialization error:', initError);
    // Continue anyway - might already be initialized
  }

  try {
    if (event.httpMethod === 'GET') {
      const members = await getMembers();
      
      // Remove passwords from response
      const safeMembers = members.map(({ password, ...member }) => member);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          members: safeMembers,
        }),
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { name, email, password, phone } = body;

      // Validation
      if (!name || !email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Name, email, and password are required',
          }),
        };
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

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Member registered successfully',
            member: safeMember,
          }),
        };
      } catch (dbError) {
        if (dbError.message && dbError.message.includes('already registered')) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Email already registered',
            }),
          };
        }
        
        console.error('Database error creating member:', dbError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to save member. Please try again.',
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
    console.error('Error in members function:', error);
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
