import { getMemberByEmail, updateMember, initializeDatabase } from './utils/database.js';
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

  // Initialize database (non-blocking, cached - won't block if already initialized)
  // Don't wait for it - let it run in background, operations will work once ready
  initializeDatabase().catch(err => {
    console.error('[LOGIN] Database initialization error (non-blocking):', err.message);
  });

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

    // Get member from database
    const member = await getMemberByEmail(sanitizedEmail);

    if (!member) {
      // Don't reveal if email exists for security
      return errorResponse('Invalid email or password', 401);
    }

    // Verify password
    let passwordMatch = false;
    try {
      // Check if password is hashed (starts with $2)
      if (member.password && member.password.startsWith('$2')) {
        // Password is hashed, use bcrypt.compare
        passwordMatch = await bcrypt.compare(password, member.password);
        
        // If password matches but is old hash, we could rehash here if needed
        // but for now we'll just verify
      } else {
        // Legacy plaintext password - compare directly and upgrade
        passwordMatch = member.password === password;
        
        if (passwordMatch) {
          // Upgrade plaintext password to hashed
          const hashedPassword = await bcrypt.hash(password, 10);
          try {
            await updateMember(member.id, { password: hashedPassword });
            console.log(`[PASSWORD UPGRADE] Upgraded plaintext password for ${member.email}`);
          } catch (updateError) {
            console.error('Error upgrading password:', updateError);
            // Continue with login even if upgrade fails
          }
        }
      }
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      return errorResponse('Authentication error', 500);
    }

    if (!passwordMatch) {
      return errorResponse('Invalid email or password', 401);
    }

    // Determine admin status (PRIORITY: Admin takes priority)
    // Double-check for reliability - ensures admin status is correct every time
    const memberEmailLower = member.email.toLowerCase();
    const isAdmin = isAdminEmail || ADMIN_EMAILS.includes(memberEmailLower);
    
    // Log admin check for debugging (can be removed in production)
    if (isAdmin) {
      console.log(`[ADMIN CHECK] Email: ${memberEmailLower}, isAdminEmail: ${isAdminEmail}, memberEmailMatch: ${ADMIN_EMAILS.includes(memberEmailLower)}`);
    }

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
