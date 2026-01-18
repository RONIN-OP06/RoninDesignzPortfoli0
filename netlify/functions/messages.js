import { initializeMessagesFile, initializeMembersFile, authenticateUser, isAdminUser, getMessagesFile, getMembersFile } from './_shared/utils.js';
import fs from 'fs/promises';

export async function handler(event, context) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const authResult = await authenticateUser(event);
  if (authResult.error) {
    return {
      statusCode: authResult.statusCode,
      body: JSON.stringify({ error: authResult.error })
    };
  }

  const { user } = authResult;

  if (!isAdminUser(user.email)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Access denied. Only administrators can view messages.' })
    };
  }

  try {
    await initializeMessagesFile();
    let messages = [];
    try {
      const data = await fs.readFile(getMessagesFile(), 'utf8');
      if (data.trim()) {
        messages = JSON.parse(data);
      }
    } catch {
      messages = [];
    }

    await initializeMembersFile();
    const membersData = await fs.readFile(getMembersFile(), 'utf8');
    const members = JSON.parse(membersData);

    const enrichedMessages = messages.map(msg => {
      const user = members.find(m => m.id === msg.userId);
      return {
        ...msg,
        userPhone: user?.phone || null
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(enrichedMessages)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read messages' })
    };
  }
}
