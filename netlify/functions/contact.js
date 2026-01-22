import { createMessage } from './utils/database.js';
import { validateEmail, validateName, sanitizeInput } from './utils/validation.js';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  if (event.httpMethod !== 'POST') {
    return handleMethodNotAllowed(['POST']);
  }

  try {
    let body;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      return errorResponse('Invalid JSON in request body', 400);
    }

    const { name, email, subject, message } = body;

    // Validate inputs
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return errorResponse(nameValidation.message, 400);
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return errorResponse(emailValidation.message, 400);
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return errorResponse('Message must be at least 5 characters', 400);
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedSubject = subject ? sanitizeInput(subject) : 'No subject';
    const sanitizedMessage = sanitizeInput(message);

    try {
      const newMessage = await createMessage({
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        message: sanitizedMessage,
      });

      console.log(`[CONTACT] New message from: ${sanitizedEmail}`);

      return successResponse(newMessage, 'Message sent successfully', 201);
    } catch (dbError) {
      console.error('[CONTACT] Database error:', dbError);
      return errorResponse('Failed to save message', 500);
    }
  } catch (error) {
    console.error('[CONTACT ERROR]', error);
    return errorResponse('Internal server error', 500, error);
  }
};
