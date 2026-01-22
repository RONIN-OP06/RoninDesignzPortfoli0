/**
 * Setup admin accounts in Fauna DB
 * Call this function once after setting up Fauna to create admin accounts
 */
import { initializeDatabase, getMemberByEmail, createMember, updateMember } from './utils/database.js';
import bcrypt from 'bcryptjs';

// Admin accounts with passwords
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
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed',
      }),
    };
  }

  try {
    // Initialize database
    await initializeDatabase();

    const created = [];
    const updated = [];
    const errors = [];
    
    for (const admin of ADMIN_ACCOUNTS) {
      try {
        const emailLower = admin.email.toLowerCase().trim();
        const existing = await getMemberByEmail(emailLower);
        
        // Check if existing member has correct password
        let needsPasswordUpdate = true;
        if (existing) {
          // Verify if existing password matches the admin password
          try {
            if (existing.password && existing.password.startsWith('$2')) {
              // Password is hashed, verify it matches
              const passwordMatches = await bcrypt.compare(admin.password, existing.password);
              if (passwordMatches) {
                needsPasswordUpdate = false;
              }
            } else {
              // Plaintext password, needs update
              needsPasswordUpdate = true;
            }
          } catch (verifyError) {
            console.error('Error verifying existing password:', verifyError);
            needsPasswordUpdate = true;
          }
        }
        
        // Hash password if needed
        const hashedPassword = needsPasswordUpdate 
          ? await bcrypt.hash(admin.password, 10)
          : existing.password;
        
        const adminData = {
          name: admin.name,
          email: emailLower,
          password: hashedPassword,
          phone: existing ? (existing.phone || '') : '',
        };
        
        if (existing) {
          // Only update if password needs updating or name changed
          if (needsPasswordUpdate || existing.name !== admin.name) {
            await updateMember(existing.id, adminData);
            updated.push(emailLower);
          }
        } else {
          await createMember(adminData);
          created.push(emailLower);
        }
      } catch (error) {
        console.error(`Error processing admin ${admin.email}:`, error);
        errors.push({ email: admin.email, error: error.message });
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Admin accounts processed',
        created,
        updated,
        errors: errors.length > 0 ? errors : undefined,
        accounts: ADMIN_ACCOUNTS.map(a => ({ 
          email: a.email, 
          name: a.name
        }))
      }),
    };
  } catch (error) {
    console.error('Error setting up admin accounts:', error);
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
