import { readData, writeData } from './db.js';
import bcrypt from 'bcryptjs';

// Admin accounts to create
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

async function createAdminAccounts() {
  try {
    const members = readData('members.json', []);
    
    for (const admin of ADMIN_ACCOUNTS) {
      const emailLower = admin.email.toLowerCase().trim();
      const existingIndex = members.findIndex(m => m.email.toLowerCase() === emailLower);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      
      const adminData = {
        id: existingIndex >= 0 ? members[existingIndex].id : Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: admin.name,
        email: emailLower,
        password: hashedPassword,
        phone: '',
        createdAt: existingIndex >= 0 ? members[existingIndex].createdAt : new Date().toISOString(),
      };
      
      if (existingIndex >= 0) {
        // Update existing member
        members[existingIndex] = adminData;
        console.log(`Updated admin: ${emailLower}`);
      } else {
        // Create new member
        members.push(adminData);
        console.log(`Created admin: ${emailLower}`);
      }
    }
    
    writeData('members.json', members);
    console.log('Admin accounts created/updated successfully!');
    
    return {
      success: true,
      message: 'Admin accounts created/updated',
      accounts: ADMIN_ACCOUNTS.map(a => ({ email: a.email, name: a.name }))
    };
  } catch (error) {
    console.error('Error creating admin accounts:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminAccounts().then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  });
}

export { createAdminAccounts };
