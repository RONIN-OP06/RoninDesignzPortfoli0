import { readData, writeData } from './utils/db.js';
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
    const members = readData('members.json', []);
    const created = [];
    const updated = [];
    
    for (const admin of ADMIN_ACCOUNTS) {
      const emailLower = admin.email.toLowerCase().trim();
      const existingIndex = members.findIndex(m => m.email.toLowerCase() === emailLower);
      
      // Check if existing member has correct password
      let needsPasswordUpdate = true;
      if (existingIndex >= 0) {
        const existingMember = members[existingIndex];
        // Verify if existing password matches the admin password
        try {
          if (existingMember.password && existingMember.password.startsWith('$2')) {
            // Password is hashed, verify it matches
            const passwordMatches = await bcrypt.compare(admin.password, existingMember.password);
            if (passwordMatches) {
              needsPasswordUpdate = false;
            }
          }
        } catch (verifyError) {
          console.error('Error verifying existing password:', verifyError);
          // If verification fails, update the password
          needsPasswordUpdate = true;
        }
      }
      
      // Hash password if needed
      const hashedPassword = needsPasswordUpdate 
        ? await bcrypt.hash(admin.password, 10)
        : members[existingIndex].password;
      
      const adminData = {
        id: existingIndex >= 0 ? members[existingIndex].id : Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: admin.name,
        email: emailLower,
        password: hashedPassword,
        phone: existingIndex >= 0 ? (members[existingIndex].phone || '') : '',
        createdAt: existingIndex >= 0 ? members[existingIndex].createdAt : new Date().toISOString(),
      };
      
      if (existingIndex >= 0) {
        // Only update if password needs updating or name changed
        if (needsPasswordUpdate || members[existingIndex].name !== admin.name) {
          members[existingIndex] = adminData;
          updated.push(emailLower);
        }
      } else {
        members.push(adminData);
        created.push(emailLower);
      }
    }
    
    writeData('members.json', members);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Admin accounts created/updated',
        created,
        updated,
        accounts: ADMIN_ACCOUNTS.map(a => ({ 
          email: a.email, 
          name: a.name,
          password: a.password  // Return password for testing
        }))
      }),
    };
  } catch (error) {
    console.error('Error creating admin accounts:', error);
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
