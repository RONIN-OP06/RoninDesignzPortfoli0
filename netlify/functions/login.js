import { initializeMembersFile, getMembersFile } from './_shared/utils.js';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    await initializeMembersFile();
    const data = await fs.readFile(getMembersFile(), 'utf8');
    const members = JSON.parse(data);

    const member = members.find(m => m.email === email);
    if (!member) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }

    let passwordMatch = false;
    if (member.password.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, member.password);
    } else {
      if (member.password === password) {
        passwordMatch = true;
        member.password = await bcrypt.hash(password, 10);
        await fs.writeFile(getMembersFile(), JSON.stringify(members, null, 2));
      }
    }

    if (passwordMatch) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Login successful',
          member: { id: member.id, name: member.name, email: member.email },
          token: member.id
        })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid email or password' })
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process login', details: error.message })
    };
  }
}
