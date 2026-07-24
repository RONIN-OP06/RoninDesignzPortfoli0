/**
 * Database utility using Netlify Blobs.
 *
 * Migrated off Fauna DB (the Fauna hosted service shut down on 2025-05-30). Netlify
 * Blobs is built into the Netlify deploy — no external service, account, or API key
 * is required; the store is auto-configured from the function's Netlify context.
 *
 * Each "collection" is a Blobs store; each record is one JSON blob keyed by its id.
 * The exported function signatures are unchanged, so the functions that import this
 * module (login, members, contact, messages, projects, setup-admins) are untouched.
 */

import { getStore } from '@netlify/blobs';

// Strong consistency so a freshly-created record (e.g. a new member) is immediately
// visible to the uniqueness check and to the next login. Volume here is tiny.
function store(name) {
  return getStore({ name, consistency: 'strong' });
}

function newId() {
  return (globalThis.crypto?.randomUUID?.() ||
    (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)));
}

// Read every record in a store as [{ id, ...data }]. Fine at this scale (a handful
// of members/messages); returns [] on any error, matching the old behaviour.
async function readAll(name) {
  const s = store(name);
  const { blobs } = await s.list();
  const out = [];
  for (const b of blobs) {
    const rec = await s.get(b.key, { type: 'json' });
    if (rec) out.push({ id: b.key, ...rec });
  }
  return out;
}

/** No schema to create with Blobs — kept for API compatibility. */
export async function initializeDatabase() {
  return true;
}

// ---- Members ---------------------------------------------------------------

export async function getMembers() {
  try {
    return await readAll('members');
  } catch (error) {
    console.error('[DB] Error getting members:', error.message);
    return [];
  }
}

export async function getMemberByEmail(email) {
  const emailLower = String(email || '').toLowerCase().trim();
  const members = await getMembers();
  return members.find(m => String(m.email || '').toLowerCase().trim() === emailLower) || null;
}

export async function getMemberById(id) {
  const rec = await store('members').get(String(id), { type: 'json' });
  return rec ? { id: String(id), ...rec } : null;
}

export async function createMember(memberData) {
  const existing = await getMemberByEmail(memberData.email);
  if (existing) {
    throw new Error('Email already registered');
  }
  const id = newId();
  const data = {
    ...memberData,
    email: String(memberData.email).toLowerCase().trim(),
    createdAt: new Date().toISOString(),
  };
  await store('members').setJSON(id, data);
  return { id, ...data };
}

export async function updateMember(id, updates) {
  const s = store('members');
  const rec = await s.get(String(id), { type: 'json' });
  if (!rec) throw new Error('Member not found');
  const data = { ...rec, ...updates };
  await s.setJSON(String(id), data);
  return { id: String(id), ...data };
}

// ---- Messages --------------------------------------------------------------

export async function getMessages() {
  try {
    return await readAll('messages');
  } catch (error) {
    console.error('[DB] Error getting messages:', error.message);
    return [];
  }
}

export async function getMessageById(id) {
  const rec = await store('messages').get(String(id), { type: 'json' });
  return rec ? { id: String(id), ...rec } : null;
}

export async function createMessage(messageData) {
  const id = newId();
  const data = {
    ...messageData,
    createdAt: new Date().toISOString(),
    read: false,
  };
  await store('messages').setJSON(id, data);
  return { id, ...data };
}

export async function updateMessage(id, updates) {
  const s = store('messages');
  const rec = await s.get(String(id), { type: 'json' });
  if (!rec) throw new Error('Message not found');
  const data = { ...rec, ...updates };
  await s.setJSON(String(id), data);
  return { id: String(id), ...data };
}

// ---- Projects (optional; the public site reads static data) ----------------

export async function getProjects() {
  try {
    return await readAll('projects');
  } catch (error) {
    console.error('[DB] Error getting projects:', error.message);
    return [];
  }
}

export async function createProject(projectData) {
  const id = newId();
  const data = { ...projectData, createdAt: new Date().toISOString() };
  await store('projects').setJSON(id, data);
  return { id, ...data };
}

export async function deleteProject(id) {
  await store('projects').delete(String(id));
  return true;
}
