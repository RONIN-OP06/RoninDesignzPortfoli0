import { initializeMembersFile, getMembersFile } from './_shared/utils.js';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';

export async function handler(event, context) {
  if (event.httpMethod === 'GET') {
    try {
      await initializeMembersFile();
      const data = await fs.readFile(getMembersFile(), 'utf8');
      const members = JSON.parse(data);
      return {
        statusCode: 200,
        body: JSON.stringify(members)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to read members' })
      };
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const { name, email, password, phone } = JSON.parse(event.body || '{}');

      if (!name || !email || !password) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Name, email, and password are required' })
        };
      }

      if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Password must be at least 8 characters with uppercase, lowercase, and number' })
        };
      }

      await initializeMembersFile();
      const data = await fs.readFile(getMembersFile(), 'utf8');
      const members = JSON.parse(data);

      if (members.some(m => m.email === email)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Email already registered' })
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newMember = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        createdAt: new Date().toISOString()
      };

      members.push(newMember);
      await fs.writeFile(getMembersFile(), JSON.stringify(members, null, 2));

      const { password: _, ...memberWithoutPassword } = newMember;
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Member registered successfully', member: memberWithoutPassword })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create member' })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}
