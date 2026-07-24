/**
 * Setup admin accounts in the database (Netlify Blobs).
 * Idempotent: purges any existing record(s) for each admin email, then creates a
 * fresh account with a new random-id token.
 */

import '../_shared/env-loader.js';
import { connectLambda } from "@netlify/blobs";
import { initializeDatabase, createMember, deleteMembersByEmail } from './utils/database.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

// Admin accounts - these must exist in the database
const ADMIN_ACCOUNTS = [
  {
    email: 'roninsyoutub123@gmail.com',
    password: '1NCORRECT1!a',
    name: 'Admin User 1'
  },
  {
    email: 'ronindesignz123@gmail.com',
    password: '1NCORRECT1a',
    name: 'Admin User 2'
  }
];

export const handler = async (event, context) => {
  // Bootstrap Netlify Blobs for this classic (Lambda-compatible) function.
  try { connectLambda(event); } catch (e) { /* Blobs env unavailable */ }
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  if (event.httpMethod !== 'POST') {
    return handleMethodNotAllowed(['POST']);
  }


  try {
    // Initialize database
    await initializeDatabase();

    const results = [];

    for (const admin of ADMIN_ACCOUNTS) {
      const emailLower = admin.email.toLowerCase().trim();
      const hashedPassword = await bcrypt.hash(admin.password, 10);

      // Purge any existing record(s) for this email (including legacy email-keyed
      // ones), then create a fresh account with a new random-id token.
      await deleteMembersByEmail(emailLower);
      await createMember({
        email: emailLower,
        password: hashedPassword,
        name: admin.name
      });
      results.push({ email: admin.email, action: 'seeded' });
      console.log(`[SETUP] Seeded admin: ${admin.email}`);
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
