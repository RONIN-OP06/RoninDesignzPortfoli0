import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = '/tmp';
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');

const ADMIN_EMAILS = [
  'ronindesignz123@gmail.com',
  'roninsyoutub123@gmail.com'
].map(e => e.toLowerCase().trim());

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
}

async function getMembers() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
  
  try {
    const data = await fs.readFile(MEMBERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    await fs.writeFile(MEMBERS_FILE, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
}

function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(String(email).toLowerCase().trim());
}

export async function handler(event, context) {
  const corsHeaders = getCorsHeaders();

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    const members = await getMembers();
    const member = members.find(m => 
      m.email && String(m.email).trim().toLowerCase() === email
    );

    if (!member || !member.password) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    let valid = false;
    if (member.password.startsWith('$2')) {
      valid = await bcrypt.compare(password, member.password);
    } else {
      valid = member.password === password;
      if (valid) {
        member.password = await bcrypt.hash(password, 10);
        const updated = members.map(m => m.id === member.id ? member : m);
        await fs.writeFile(MEMBERS_FILE, JSON.stringify(updated, null, 2), 'utf8');
      }
    }

    if (!valid) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    const admin = isAdminEmail(member.email);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Login successful',
        member: {
          id: member.id,
          name: member.name,
          email: member.email,
          isAdmin: admin
        },
        token: member.id,
        isAdmin: admin
      })
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Login failed', message: error.message })
    };
  }
}
