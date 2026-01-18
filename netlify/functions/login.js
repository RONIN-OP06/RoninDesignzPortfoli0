import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isNetlify = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = isNetlify ? '/tmp' : path.resolve(__dirname, '..', '..', 'data');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

async function ensureMembersFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  
  try {
    await fs.access(MEMBERS_FILE);
  } catch {
    await fs.writeFile(MEMBERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

async function loadMembers() {
  try {
    const data = await fs.readFile(MEMBERS_FILE, 'utf8');
    if (!data || !data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await ensureMembersFile();
      return [];
    }
    throw error;
  }
}

export async function handler(event, context) {
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

  try {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    await ensureMembersFile();
    const members = await loadMembers();

    const member = members.find(m => m.email && m.email.toLowerCase() === email.toLowerCase());
    
    if (!member) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    let passwordMatch = false;
    
    if (member.password && member.password.startsWith('$2')) {
      try {
        passwordMatch = await bcrypt.compare(password, member.password);
      } catch (bcryptError) {
        console.error('Bcrypt compare error:', bcryptError);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Authentication error' })
        };
      }
    } else if (member.password === password) {
      passwordMatch = true;
      try {
        member.password = await bcrypt.hash(password, 10);
        await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2), 'utf8');
      } catch (writeError) {
        console.error('Password hash write error:', writeError);
      }
    }

    if (passwordMatch) {
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Login successful',
          member: {
            id: member.id,
            name: member.name,
            email: member.email
          },
          token: member.id
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
