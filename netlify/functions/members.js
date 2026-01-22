import { readData, writeData, generateId } from './utils/db.js';
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

  try {
    if (event.httpMethod === 'GET') {
      const members = readData('members.json', []);
      
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

      const members = readData('members.json', []);

      // Check if email already exists
      if (members.some(m => m.email.toLowerCase() === email.toLowerCase())) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Email already registered',
          }),
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new member
      const newMember = {
        id: generateId(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        createdAt: new Date().toISOString(),
      };

      members.push(newMember);
      const writeSuccess = writeData('members.json', members);

      if (!writeSuccess) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to save member. Please try again.',
          }),
        };
      }

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
