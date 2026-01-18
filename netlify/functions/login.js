import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isNetlify = !!(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isNetlify ? '/tmp' : path.resolve(__dirname, '..', '..', 'data');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

async function ensureMembersFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST' && error.code !== 'EACCES') {
      console.error('Error creating data directory:', error);
    }
  }
  
  try {
    await fs.access(MEMBERS_FILE);
  } catch {
    try {
      await fs.writeFile(MEMBERS_FILE, JSON.stringify([], null, 2), 'utf8');
    } catch (writeError) {
      console.error('Error creating members file:', writeError);
    }
  }
}

async function loadMembers() {
  try {
    const data = await fs.readFile(MEMBERS_FILE, 'utf8');
    if (!data || !data.trim()) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      await ensureMembersFile();
      return [];
    }
    console.error('Error loading members:', error);
    return [];
  }
}

export async function handler(event, context) {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    let body;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    const email = body.email ? String(body.email).trim() : '';
    const password = body.password ? String(body.password) : '';

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    await ensureMembersFile();
    const members = await loadMembers();

    if (!Array.isArray(members)) {
      console.error('Members is not an array:', typeof members);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    const normalizedEmail = email.toLowerCase();
    const member = members.find(m => {
      if (!m || !m.email) return false;
      return String(m.email).trim().toLowerCase() === normalizedEmail;
    });
    
    if (!member) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    if (!member.password) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    let passwordMatch = false;
    
    try {
      if (String(member.password).startsWith('$2')) {
        passwordMatch = await bcrypt.compare(password, member.password);
      } else if (member.password === password) {
        passwordMatch = true;
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          member.password = hashedPassword;
          const updatedMembers = members.map(m => 
            m.id === member.id ? { ...m, password: hashedPassword } : m
          );
          await fs.writeFile(MEMBERS_FILE, JSON.stringify(updatedMembers, null, 2), 'utf8');
        } catch (writeError) {
          console.error('Password hash write error:', writeError);
        }
      }
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Authentication error' })
      };
    }

    if (passwordMatch) {
      const adminEmails = (process.env.ADMIN_EMAILS || 'ronindesignz123@gmail.com,roninsyoutub123@gmail.com')
        .split(',')
        .map(e => String(e).trim().toLowerCase())
        .filter(e => e.length > 0);
      
      const isAdmin = adminEmails.includes(member.email.toLowerCase());
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Login successful',
          member: {
            id: String(member.id || ''),
            name: String(member.name || ''),
            email: String(member.email || '')
          },
          token: String(member.id || ''),
          isAdmin: !!isAdmin
        })
      };
    } else {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }
  } catch (error) {
    console.error('Login handler error:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to process login',
        message: error.message || 'Unknown error'
      })
    };
  }
}
