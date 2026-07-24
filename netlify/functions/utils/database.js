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

// Strong consistency isn't available to classic Lambda-compatible functions
// (BlobsConsistencyError), so use the default (eventual) consistency. At this
// volume the tiny replication lag is harmless: the admin is seeded once, and
// signup/contact writes are read back later, not in the same request.
function store(name) {
  return getStore(name);
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
// Members are keyed by a RANDOM id, which doubles as the bearer token used to
// authenticate admin requests. Keying by email would make the token the (public)
// email address — trivially forgeable — so we key by a secret random id instead.
// getMemberById is therefore a DIRECT, immediately-consistent key read (used to
// validate the token on every admin request). getMemberByEmail scans via list()
// (eventually consistent), which is fine for login: the admin is seeded once and
// logs in later, not within the same request as its creation.

const emailNorm = (email) => String(email || '').toLowerCase().trim();

export async function getMembers() {
  try {
    return await readAll('members');
  } catch (error) {
    console.error('[DB] Error getting members:', error.message);
    return [];
  }
}

export async function getMemberByEmail(email) {
  const key = emailNorm(email);
  if (!key) return null;
  const members = await getMembers();
  return members.find(m => emailNorm(m.email) === key) || null;
}

export async function getMemberById(id) {
  if (!id) return null;
  const rec = await store('members').get(String(id), { type: 'json' });
  return rec ? { id: String(id), ...rec } : null;
}

export async function createMember(memberData) {
  const email = emailNorm(memberData.email);
  if (!email) throw new Error('Email is required');
  const existing = await getMemberByEmail(email);
  if (existing) throw new Error('Email already registered');
  const id = newId();   // random & secret — this is the auth token
  const data = { ...memberData, email, createdAt: new Date().toISOString() };
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

// Remove every member record with this email (whatever its key). Used by
// setup-admins to re-seed cleanly and to purge any legacy / email-keyed records.
export async function deleteMembersByEmail(email) {
  const key = emailNorm(email);
  const s = store('members');
  const { blobs } = await s.list();
  for (const b of blobs) {
    const rec = await s.get(b.key, { type: 'json' });
    if (rec && emailNorm(rec.email) === key) {
      await s.delete(b.key).catch(() => {});
    }
  }
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
