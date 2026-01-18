import { initializeMessagesFile, initializeMembersFile, authenticateUser, getMessagesFile, getMembersFile } from './_shared/utils.js';
import fs from 'fs/promises';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
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
  const { name, email, subject, message } = JSON.parse(event.body || '{}');

  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'All fields are required' })
    };
  }

  try {
    await initializeMembersFile();
    const membersData = await fs.readFile(getMembersFile(), 'utf8');
    const members = JSON.parse(membersData);
    const member = members.find(m => m.id === user.id);

    if (!member) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User account not found' })
      };
    }

    await initializeMessagesFile();
    let messages = [];
    try {
      const messagesData = await fs.readFile(getMessagesFile(), 'utf8');
      if (messagesData.trim()) {
        messages = JSON.parse(messagesData);
      }
    } catch {
      messages = [];
    }

    const newMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: name,
      userEmail: email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false
    };

    messages.push(newMessage);
    await fs.writeFile(getMessagesFile(), JSON.stringify(messages, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully! I\'ll get back to you soon.', messageId: newMessage.id })
    };
  } catch (error) {
    console.error('Contact error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message. Please try again later.', details: error.message })
    };
  }
}
