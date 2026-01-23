/**
 * Login function - Clean, simple, focused on admin login reliability
 */

import '../_shared/env-loader.js';
import { getMemberByEmail, updateMember, initializeDatabase } from './utils/database.js';
import bcrypt from 'bcryptjs';
import { validateEmail, sanitizeInput } from './utils/validation.js';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

// Admin emails - these are the only admin accounts
const ADMIN_EMAILS = [
  'ronindesignz123@gmail.com',
  'roninsyoutub123@gmail.com'
].map(e => e.trim().toLowerCase());

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return handleMethodNotAllowed(['POST']);
  }

  // Check database configuration
  if (!process.env.FAUNA_SECRET_KEY) {
    return errorResponse(
      'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables.',
      503
    );
  }

  // Initialize database (non-blocking, cached)
  initializeDatabase().catch(err => {
    console.error('[LOGIN] Database init error:', err.message);
  });

  try {
    // Parse request body
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

    // Normalize email
    const normalizedEmail = sanitizeInput(email).toLowerCase().trim();

    // Check if this is an admin email
    const isAdminEmail = ADMIN_EMAILS.includes(normalizedEmail);

    // Get member from database
    const member = await getMemberByEmail(normalizedEmail);

    if (!member) {
      return errorResponse('Invalid email or password', 401);
    }

    // Verify password
    let passwordMatch = false;
    
    if (member.password && member.password.startsWith('$2')) {
      // Password is hashed
      passwordMatch = await bcrypt.compare(password, member.password);
    } else {
      // Legacy plaintext password - upgrade it
      passwordMatch = member.password === password;
      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateMember(member.id, { password: hashedPassword }).catch(() => {
          // Continue even if upgrade fails
        });
      }
    }

    if (!passwordMatch) {
      return errorResponse('Invalid email or password', 401);
    }

    // Determine admin status
    const memberEmailLower = member.email.toLowerCase().trim();
    const isAdmin = isAdminEmail || ADMIN_EMAILS.includes(memberEmailLower);

    // Remove password from response
    const { password: _, ...safeMember } = member;

    // Prepare response
    const memberData = {
      ...safeMember,
      isAdmin
    };

    console.log(`[LOGIN] ${isAdmin ? 'ADMIN' : 'USER'} login: ${member.email}`);

    return successResponse(
      {
        member: memberData,
        isAdmin
      },
      'Login successful'
    );
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return errorResponse('Internal server error', 500, error);
  }
};
