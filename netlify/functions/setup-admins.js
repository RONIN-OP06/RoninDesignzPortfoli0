/**
 * Setup admin accounts in database
 * Run this once after setting up FaunaDB
 */

import '../_shared/env-loader.js';
import { initializeDatabase, getMemberByEmail, createMember, updateMember } from './utils/database.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

// Admin accounts - these must exist in the database
const ADMIN_ACCOUNTS = [
  {
    email: 'roninsyoutub123@gmail.com',
    password: '1NCORRECT1a',
    name: 'Admin User 1'
  },
  {
    email: 'ronindesignz123@gmail.com',
    password: '1NCORRECT1a',
    name: 'Admin User 2'
  }
];

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  if (event.httpMethod !== 'POST') {
    return handleMethodNotAllowed(['POST']);
  }

  if (!process.env.FAUNA_SECRET_KEY) {
    return errorResponse(
      'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables.',
      503
    );
  }

  try {
    // Initialize database
    await initializeDatabase();

    const results = [];

    for (const admin of ADMIN_ACCOUNTS) {
      const emailLower = admin.email.toLowerCase().trim();
      const existing = await getMemberByEmail(emailLower);

      // Hash password
      const hashedPassword = await bcrypt.hash(admin.password, 10);

      if (existing) {
        // Update existing account
        await updateMember(existing.id, {
          password: hashedPassword,
          name: admin.name,
          email: emailLower
        });
        results.push({ email: admin.email, action: 'updated' });
        console.log(`[SETUP] Updated admin: ${admin.email}`);
      } else {
        // Create new account
        await createMember({
          email: emailLower,
          password: hashedPassword,
          name: admin.name
        });
        results.push({ email: admin.email, action: 'created' });
        console.log(`[SETUP] Created admin: ${admin.email}`);
      }
    }

    return successResponse(
      {
        message: 'Admin accounts setup complete',
        results
      },
      'Admin accounts configured successfully'
    );
  } catch (error) {
    console.error('[SETUP ERROR]', error);
    return errorResponse('Failed to setup admin accounts', 500, error);
  }
};
