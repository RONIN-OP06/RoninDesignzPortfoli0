import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.NETLIFY ? '/tmp' : path.resolve(__dirname, '..', '..', 'data');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const PROJECTS_FILE = path.resolve(__dirname, '..', '..', 'src', 'data', 'projects.js');
const PROJECTS_FILE_URL = pathToFileURL(PROJECTS_FILE).href;

export async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await initializeMembersFile();
  await initializeMessagesFile();
}

export async function initializeMembersFile() {
  try {
    await fs.access(MEMBERS_FILE);
  } catch {
    await fs.writeFile(MEMBERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

export async function initializeMessagesFile() {
  try {
    await fs.access(MESSAGES_FILE);
  } catch {
    await fs.writeFile(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

export async function loadProjects() {
  const module = await import(`${PROJECTS_FILE_URL}?v=${Date.now()}`);
  return Array.isArray(module.projects) ? module.projects : [];
}

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'ronindesignz123@gmail.com,roninsyoutub123@gmail.com')
  .split(',')
  .map(e => e.trim().toLowerCase());

export function isAdminUser(userEmail) {
  return ADMIN_EMAILS.includes(userEmail?.toLowerCase());
}

export async function authenticateUser(event) {
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authentication required', statusCode: 401 };
  }

  const token = authHeader.substring(7);
  await initializeMembersFile();
  const data = await fs.readFile(MEMBERS_FILE, 'utf8');
  const members = JSON.parse(data);

  const member = members.find(m => m.id === token);
  if (!member) {
    return { error: 'Invalid authentication token', statusCode: 401 };
  }

  return { user: { id: member.id, name: member.name, email: member.email } };
}

export function getMembersFile() {
  return MEMBERS_FILE;
}

export function getMessagesFile() {
  return MESSAGES_FILE;
}

export function getProjectsFile() {
  return PROJECTS_FILE;
}
