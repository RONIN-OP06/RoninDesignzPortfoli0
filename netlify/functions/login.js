import { readData } from './utils/db.js';
import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, sanitizeInput } from './utils/validation.js';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

// Admin emails - PRIORITY: Admin login takes priority
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'ronindesignz123@gmail.com,roninsyoutub123@gmail.com')
  .split(',')
  .map(e => e.trim().toLowerCase());

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return handleMethodNotAllowed(['POST']);
  }

  try {
    // Parse and validate request body
    let body;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      return errorResponse('Invalid JSON in request body', 400);
    }

    const { email, password } = body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return errorResponse(emailValidation.message, 400);
    }

    // Validate password
    if (!password || typeof password !== 'string') {
      return errorResponse('Password is required', 400);
    }

    // Sanitize email
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // PRIORITY: Check if admin email first (admin login takes priority)
    const isAdminEmail = ADMIN_EMAILS.includes(sanitizedEmail);

    // Load members
    const members = readData('members.json', []);
    
    // Find member by email
    const member = members.find(m => m.email.toLowerCase() === sanitizedEmail);

    if (!member) {
      // Don't reveal if email exists for security
      return errorResponse('Invalid email or password', 401);
    }

    // Verify password
    let passwordMatch;
    try {
      passwordMatch = await bcrypt.compare(password, member.password);
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      return errorResponse('Authentication error', 500);
    }

    if (!passwordMatch) {
      return errorResponse('Invalid email or password', 401);
    }

    // Determine admin status (PRIORITY: Admin takes priority)
    const isAdmin = isAdminEmail || ADMIN_EMAILS.includes(member.email.toLowerCase());

    // Remove password from response
    const { password: _, ...safeMember } = member;

    // Prepare response data
    const memberData = {
      ...safeMember,
      isAdmin, // Include isAdmin in member object
    };

    // Log successful login (admin priority)
    if (isAdmin) {
      console.log(`[ADMIN LOGIN] ${member.email} logged in successfully`);
    } else {
      console.log(`[USER LOGIN] ${member.email} logged in successfully`);
    }

    return successResponse(
      {
        member: memberData,
        isAdmin,
      },
      'Login successful'
    );
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return errorResponse('Internal server error', 500, error);
  }
};
