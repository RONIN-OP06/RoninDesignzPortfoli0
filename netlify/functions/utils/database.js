/**
 * Database utility using Fauna DB
 * Clean, simple implementation focused on reliability
 */

import faunadb from 'faunadb';

const { Client, query } = faunadb;

// Fauna client singleton
let client = null;

function getClient() {
  if (!client) {
    const secret = process.env.FAUNA_SECRET_KEY;
    
    if (!secret) {
      throw new Error('FAUNA_SECRET_KEY not configured. Set it in Netlify environment variables.');
    }
    
    client = new Client({ 
      secret,
      keepAlive: false,
      timeout: 10000 // 10 second timeout
    });
  }
  
  return client;
}

const COLLECTIONS = {
  MEMBERS: 'members',
  MESSAGES: 'messages',
  PROJECTS: 'projects'
};

// Cache initialization state
let initPromise = null;
let initComplete = false;

/**
 * Initialize database - creates collections and indexes if needed
 * Idempotent and cached
 */
export async function initializeDatabase() {
  if (initComplete) return true;
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      const faunaClient = getClient();
      
      // Create collections
      const collections = [COLLECTIONS.MEMBERS, COLLECTIONS.MESSAGES, COLLECTIONS.PROJECTS];
      await Promise.allSettled(
        collections.map(name =>
          faunaClient.query(
            query.If(
              query.Exists(query.Collection(name)),
              true,
              query.CreateCollection({ name })
            )
          )
        )
      );
      
      // Create email index for members
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
      ).catch(() => {}); // Ignore if already exists
      
      initComplete = true;
      return true;
    } catch (error) {
      console.error('[DB] Initialization error:', error.message);
      initPromise = null; // Allow retry
      throw error;
    }
  })();
  
  return initPromise;
}

/**
 * Get member by email
 */
export async function getMemberByEmail(email) {
  try {
    const faunaClient = getClient();
    const emailLower = email.toLowerCase().trim();
    
    const response = await faunaClient.query(
      query.Get(query.Match(query.Index('members_by_email'), emailLower))
    );
    
    return {
      id: response.ref.id,
      ...response.data
    };
  } catch (error) {
    if (error.message && error.message.includes('not found')) {
      return null;
    }
    throw error;
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
    throw error;
  }
}

/**
 * Create a new member
 */
export async function createMember(memberData) {
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
}

/**
 * Update a member
 */
export async function updateMember(id, updates) {
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
    console.error('[DB] Error getting members:', error.message);
    return [];
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
        query.Paginate(query.Documents(query.Collection(COLLECTIONS.MESSAGES))),
        query.Lambda('ref', query.Get(query.Var('ref')))
      )
    );
    
    return response.data.map(item => ({
      id: item.ref.id,
      ...item.data
    }));
  } catch (error) {
    console.error('[DB] Error getting messages:', error.message);
    return [];
  }
}

/**
 * Create a message
 */
export async function createMessage(messageData) {
  const faunaClient = getClient();
  
  const data = {
    ...messageData,
    createdAt: new Date().toISOString(),
    read: false
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
}

/**
 * Update a message
 */
export async function updateMessage(id, updates) {
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
    console.error('[DB] Error getting projects:', error.message);
    return [];
  }
}

/**
 * Create a project
 */
export async function createProject(projectData) {
  const faunaClient = getClient();
  
  const data = {
    ...projectData,
    createdAt: new Date().toISOString()
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
}

/**
 * Delete a project
 */
export async function deleteProject(id) {
  const faunaClient = getClient();
  
  await faunaClient.query(
    query.Delete(query.Ref(query.Collection(COLLECTIONS.PROJECTS), id))
  );
  
  return true;
}
