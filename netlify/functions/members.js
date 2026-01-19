import { readData, writeData, generateId } from './utils/db.js';
import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, validateName, validatePhone, sanitizeInput } from './utils/validation.js';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

// Admin emails
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'ronindesignz123@gmail.com,roninsyoutub123@gmail.com')
  .split(',')
  .map(e => e.trim().toLowerCase());

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  try {
    // GET - Retrieve all members (admin only in production)
    if (event.httpMethod === 'GET') {
      const members = readData('members.json', []);
      
      // Remove passwords from response
      const safeMembers = members.map(({ password, ...member }) => {
        const isAdmin = ADMIN_EMAILS.includes(member.email?.toLowerCase() || '');
        return {
          ...member,
          isAdmin,
        };
      });
      
      return successResponse({ members: safeMembers });
    }

    // POST - Register new member (PRIORITY: Sign in takes priority)
    if (event.httpMethod === 'POST') {
      // Parse request body
      let body;
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch (parseError) {
        return errorResponse('Invalid JSON in request body', 400);
      }

      const { name, email, password, phone } = body;

      // Validate all fields
      const nameValidation = validateName(name);
      if (!nameValidation.valid) {
        return errorResponse(nameValidation.message, 400);
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return errorResponse(emailValidation.message, 400);
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return errorResponse(passwordValidation.message, 400);
      }

      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.valid) {
        return errorResponse(phoneValidation.message, 400);
      }

      // Sanitize inputs
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      const sanitizedPhone = phone ? phone.replace(/\D/g, '').slice(0, 10) : '';

      // Load existing members
      const members = readData('members.json', []);

      // Check if email already exists
      if (members.some(m => m.email.toLowerCase() === sanitizedEmail)) {
        return errorResponse('Email already registered', 400);
      }

      // Hash password with proper error handling
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        return errorResponse('Registration error', 500);
      }

      // Create new member
      const newMember = {
        id: generateId(),
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        phone: sanitizedPhone,
        createdAt: new Date().toISOString(),
      };

      // Save member
      members.push(newMember);
      const writeSuccess = writeData('members.json', members);

      if (!writeSuccess) {
        return errorResponse('Failed to save member', 500);
      }

      // Remove password from response
      const { password: _, ...safeMember } = newMember;

      // Check if admin
      const isAdmin = ADMIN_EMAILS.includes(sanitizedEmail);

      console.log(`[SIGNUP] New member registered: ${sanitizedEmail}${isAdmin ? ' (ADMIN)' : ''}`);

      return successResponse(
        {
          member: {
            ...safeMember,
            isAdmin,
          },
        },
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
