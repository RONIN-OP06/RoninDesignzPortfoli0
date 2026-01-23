/**
 * Database utility using Fauna DB
 * Provides persistent storage for Netlify Functions
 */

import faunadb from 'faunadb';
import { appendFile } from 'fs/promises';
import { join } from 'path';

const { Client, query } = faunadb;

// Debug logging helper
async function debugLog(location, message, data, hypothesisId) {
  const logEntry = JSON.stringify({
    location,
    message,
    data,
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId
  }) + '\n';
  
  try {
    // Try HTTP logging first
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, message, data, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId })
      }).catch(() => {});
    }
    
    // Also write to file as fallback
    const logPath = join(process.cwd(), '.cursor', 'debug.log');
    await appendFile(logPath, logEntry).catch(() => {});
  } catch (err) {
    // Silent fail - don't break the app
  }
}

// Initialize Fauna client
let client = null;
let initPromise = null;
let initComplete = false;

function getClient() {
  if (!client) {
    const secret = process.env.FAUNA_SECRET_KEY;
    
    // #region agent log
    debugLog('database.js:47', 'getClient called', { hasSecret: !!secret, secretLength: secret?.length || 0 }, 'I3').catch(() => {});
    // #endregion
    
    if (!secret) {
      console.error('[DB] FAUNA_SECRET_KEY environment variable is not set');
      console.error('[DB] Available env vars:', Object.keys(process.env).filter(k => k.includes('FAUNA') || k.includes('NETLIFY')));
      console.error('[DB] NODE_ENV:', process.env.NODE_ENV);
      console.error('[DB] NETLIFY:', process.env.NETLIFY);
      throw new Error('Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables.');
    }
    
    // Best practice: Validate key format (relaxed - some keys might be shorter)
    if (!secret.startsWith('fn') || secret.length < 30) {
      // #region agent log
      debugLog('database.js:60', 'Invalid key format', { keyLength: secret.length, startsWith: secret.substring(0, 5) }, 'I3').catch(() => {});
      // #endregion
      console.error('[DB] FAUNA_SECRET_KEY appears invalid (should start with "fn" and be 30+ chars)');
      console.error('[DB] Key length:', secret.length, 'starts with:', secret.substring(0, 5));
      throw new Error('Invalid FAUNA_SECRET_KEY format. Key should start with "fn" and be 30+ characters. Get your key from https://dashboard.fauna.com/');
    }
    
    // Log that we have the key (but not the actual key for security)
    console.log('[DB] Fauna client initialized (key length:', secret.length, 'format: valid)');
    
    // #region agent log
    debugLog('database.js:69', 'Creating Fauna client', { keyLength: secret.length, timeout: 30000 }, 'I3').catch(() => {});
    // #endregion
    
    client = new Client({ 
      secret,
      // Best practice: Optimize connection settings for serverless
      keepAlive: false,
      timeout: 30000, // 30 second timeout for slow connections
      // Best practice: Add retry logic
      http2SessionIdleTime: 5000
    });
  }
  
  return client;
}

// Collection names
const COLLECTIONS = {
  MEMBERS: 'members',
  MESSAGES: 'messages',
  PROJECTS: 'projects'
};

/**
 * Initialize database collections (idempotent, cached)
 * Returns immediately if already initialized or initializing
 */
export async function initializeDatabase() {
  // If already initialized, return immediately
  if (initComplete) {
    return true;
  }
  
  // If initialization is in progress, wait for it
  if (initPromise) {
    return initPromise;
  }
  
  // Start initialization (non-blocking, cached)
  initPromise = (async () => {
    try {
      const faunaClient = getClient();
      
      // Create collections in parallel for speed
      const collections = [COLLECTIONS.MEMBERS, COLLECTIONS.MESSAGES, COLLECTIONS.PROJECTS];
      const collectionPromises = collections.map(async (collectionName) => {
        try {
          await faunaClient.query(
            query.If(
              query.Exists(query.Collection(collectionName)),
              true,
              query.CreateCollection({ name: collectionName })
            )
          );
        } catch (error) {
          // Collection might already exist, that's okay
          if (error.message && !error.message.includes('already exists') && !error.message.includes('instance not found')) {
            console.error(`Error creating collection ${collectionName}:`, error.message);
          }
        }
      });
      
      // Wait for all collections to be created (or fail gracefully)
      await Promise.allSettled(collectionPromises);
      
      // Create index for members (email lookup)
      try {
        await faunaClient.query(
          query.If(
            query.Exists(query.Index('members_by_email')),
            true,
            query.CreateIndex({
              name: 'members_by_email',
              source: query.Collection(COLLECTIONS.MEMBERS),
              terms: [{ field: ['data', 'email'] }],
              unique: true
            })
          )
        );
      } catch (error) {
        if (error.message && !error.message.includes('already exists') && !error.message.includes('instance not found')) {
          console.error('Error creating members_by_email index:', error.message);
        }
      }
      
      initComplete = true;
      return true;
    } catch (error) {
      console.error('Error initializing database:', error.message);
      // Reset promise on error so it can be retried
      initPromise = null;
      return false;
    }
  })();
  
  return initPromise;
}

/**
 * Get all members
 */
export async function getMembers() {
  try {
    const faunaClient = getClient();
    const response = await faunaClient.query(
      query.Map(
        query.Paginate(query.Documents(query.Collection(COLLECTIONS.MEMBERS))),
        query.Lambda('ref', query.Get(query.Var('ref')))
      )
    );
    
    return response.data.map(item => ({
      id: item.ref.id,
      ...item.data
    }));
  } catch (error) {
    console.error('Error getting members:', error);
    return [];
  }
}

/**
 * Get member by email
 */
export async function getMemberByEmail(email) {
  const queryStart = Date.now();
  try {
    const faunaClient = getClient();
    const emailLower = email.toLowerCase().trim();
    
    await debugLog('database.js:149', 'getMemberByEmail start', { emailLower }, 'B');

    // Try to use index first (fastest)
    try {
      const response = await faunaClient.query(
        query.Get(query.Match(query.Index('members_by_email'), emailLower))
      );
      const queryTime = Date.now() - queryStart;
      await debugLog('database.js:157', 'Member found via index', { memberId: response.ref.id, queryTime }, 'B');
      
      return {
        id: response.ref.id,
        ...response.data
      };
    } catch (indexError) {
      // If index doesn't exist yet, fall back to scanning (slower but works)
      if (indexError.message && (indexError.message.includes('not found') || indexError.message.includes('instance not found'))) {
        console.log('[DB] Index not ready, falling back to scan...');
        await debugLog('database.js:166', 'Index not found, using fallback', { error: indexError.message }, 'B');
        // Fallback: get all members and filter (only for first few requests)
        const allMembers = await getMembers();
        const member = allMembers.find(m => m.email && m.email.toLowerCase() === emailLower);
        const queryTime = Date.now() - queryStart;
        await debugLog('database.js:170', 'Fallback scan result', { memberFound: !!member, queryTime }, 'B');
        return member || null;
      }
      throw indexError;
    }
  } catch (error) {
    const queryTime = Date.now() - queryStart;
    await debugLog('database.js:175', 'getMemberByEmail error', { error: error.message, queryTime }, 'B');

    if (error.message && error.message.includes('not found')) {
      return null;
    }
    // If database not configured, return null (will show "invalid credentials")
    if (error.message && error.message.includes('Database not configured')) {
      console.error('[DB] Database not configured - please set FAUNA_SECRET_KEY');
      return null;
    }
    console.error('Error getting member by email:', error.message || error);
    return null;
  }
}

/**
 * Get member by ID
 */
export async function getMemberById(id) {
  try {
    const faunaClient = getClient();
    const response = await faunaClient.query(
      query.Get(query.Ref(query.Collection(COLLECTIONS.MEMBERS), id))
    );
    
    return {
      id: response.ref.id,
      ...response.data
    };
  } catch (error) {
    if (error.message && error.message.includes('not found')) {
      return null;
    }
    console.error('Error getting member by ID:', error);
    return null;
  }
}

/**
 * Create a new member
 */
export async function createMember(memberData) {
  try {
    const faunaClient = getClient();
    
    // Check if email already exists
    const existing = await getMemberByEmail(memberData.email);
    if (existing) {
      throw new Error('Email already registered');
    }
    
    const data = {
      ...memberData,
      email: memberData.email.toLowerCase().trim(),
      createdAt: new Date().toISOString()
    };
    
    const response = await faunaClient.query(
      query.Create(
        query.Collection(COLLECTIONS.MEMBERS),
        { data }
      )
    );
    
    return {
      id: response.ref.id,
      ...response.data
    };
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
}

/**
 * Update a member
 */
export async function updateMember(id, updates) {
  try {
    const faunaClient = getClient();
    
    const response = await faunaClient.query(
      query.Update(
        query.Ref(query.Collection(COLLECTIONS.MEMBERS), id),
        { data: updates }
      )
    );
    
    return {
      id: response.ref.id,
      ...response.data
    };
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
}

/**
 * Get all messages
 */
export async function getMessages() {
  try {
    const faunaClient = getClient();
    const response = await faunaClient.query(
      query.Map(
        query.Paginate(
          query.Documents(query.Collection(COLLECTIONS.MESSAGES)),
          { size: 1000 }
        ),
        query.Lambda('ref', query.Get(query.Var('ref')))
      )
    );
    
    return response.data.map(item => ({
      id: item.ref.id,
      ...item.data
    }));
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

/**
 * Create a new message
 */
export async function createMessage(messageData) {
  try {
    const faunaClient = getClient();
    
    const data = {
      ...messageData,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    const response = await faunaClient.query(
      query.Create(
        query.Collection(COLLECTIONS.MESSAGES),
        { data }
      )
    );
    
    return {
      id: response.ref.id,
      ...response.data
    };
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

/**
 * Update a message
 */
export async function updateMessage(id, updates) {
  try {
    const faunaClient = getClient();
    
    const response = await faunaClient.query(
      query.Update(
        query.Ref(query.Collection(COLLECTIONS.MESSAGES), id),
        { data: updates }
      )
    );
    
    return {
      id: response.ref.id,
      ...response.data
    };
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
}

/**
 * Get message by ID
 */
export async function getMessageById(id) {
  try {
    const faunaClient = getClient();
    const response = await faunaClient.query(
      query.Get(query.Ref(query.Collection(COLLECTIONS.MESSAGES), id))
    );
    
    return {
      id: response.ref.id,
      ...response.data
    };
  } catch (error) {
    if (error.message && error.message.includes('not found')) {
      return null;
    }
    console.error('Error getting message by ID:', error);
    return null;
  }
}

/**
 * Get all projects
 */
export async function getProjects() {
  try {
    const faunaClient = getClient();
    const response = await faunaClient.query(
      query.Map(
        query.Paginate(query.Documents(query.Collection(COLLECTIONS.PROJECTS))),
        query.Lambda('ref', query.Get(query.Var('ref')))
      )
    );
    
    return response.data.map(item => ({
      id: item.ref.id,
      ...item.data
    }));
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
}

/**
 * Create a new project
 */
export async function createProject(projectData) {
  try {
    const faunaClient = getClient();
    
    const data = {
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await faunaClient.query(
      query.Create(
        query.Collection(COLLECTIONS.PROJECTS),
        { data }
      )
    );
    
    return {
      id: response.ref.id,
      ...response.data
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id) {
  try {
    const faunaClient = getClient();
    
    await faunaClient.query(
      query.Delete(query.Ref(query.Collection(COLLECTIONS.PROJECTS), id))
    );
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

/**
 * Generate a unique ID (for compatibility with old code)
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
