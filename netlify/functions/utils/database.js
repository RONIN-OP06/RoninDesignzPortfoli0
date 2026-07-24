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
// Members are keyed by their normalized email (a natural unique id), so
// getMemberByEmail / getMemberById are DIRECT key reads — immediately consistent
// after a write (no eventual-consistency lag on login / signup). Blobs list() is
// only eventually consistent, so it's used solely for the admin "all members"
// view, where a few seconds of replication lag is harmless.

const memberKey = (email) => String(email || '').toLowerCase().trim();

export async function getMemberByEmail(email) {
  const key = memberKey(email);
  if (!key) return null;
  const rec = await store('members').get(key, { type: 'json' });
  return rec ? { id: key, ...rec } : null;
}

export async function getMemberById(id) {
  // ids ARE the normalized email (members are keyed by email).
  const key = memberKey(id);
  if (!key) return null;
  const rec = await store('members').get(key, { type: 'json' });
  return rec ? { id: key, ...rec } : null;
}

export async function createMember(memberData) {
  const key = memberKey(memberData.email);
  if (!key) throw new Error('Email is required');
  const existing = await store('members').get(key, { type: 'json' });
  if (existing) throw new Error('Email already registered');
  const data = { ...memberData, email: key, createdAt: new Date().toISOString() };
  await store('members').setJSON(key, data);
  return { id: key, ...data };
}

export async function updateMember(id, updates) {
  const key = memberKey(id);
  const s = store('members');
  const rec = await s.get(key, { type: 'json' });
  if (!rec) throw new Error('Member not found');
  const { email: _email, ...rest } = updates;   // email is the key; don't drift it
  const data = { ...rec, ...rest };
  await s.setJSON(key, data);
  return { id: key, ...data };
}

export async function getMembers() {
  try {
    const all = await readAll('members');
    // De-duplicate by email (guards against any legacy id-keyed records).
    const byEmail = new Map();
    for (const m of all) {
      const e = memberKey(m.email);
      if (e && !byEmail.has(e)) byEmail.set(e, { ...m, id: e });
    }
    return [...byEmail.values()];
  } catch (error) {
    console.error('[DB] Error getting members:', error.message);
    return [];
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
