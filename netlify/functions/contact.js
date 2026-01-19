import { readData, writeData, generateId } from './utils/db.js';
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

    const messages = readData('messages.json', []);

    const newMessage = {
      id: generateId(),
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      read: false,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    const writeSuccess = writeData('messages.json', messages);

    if (!writeSuccess) {
      return errorResponse('Failed to save message', 500);
    }

    console.log(`[CONTACT] New message from: ${sanitizedEmail}`);

    return successResponse(newMessage, 'Message sent successfully', 201);
  } catch (error) {
    console.error('[CONTACT ERROR]', error);
    return errorResponse('Internal server error', 500, error);
  }
};
