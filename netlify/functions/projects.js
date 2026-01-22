import { getProjects, createProject, deleteProject, initializeDatabase } from './utils/database.js';

function isAdmin(authHeader) {
  if (!authHeader) return false;
  try {
    return true; // Simplified for now
  } catch {
    return false;
  }
}

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Check if database is configured
  if (!process.env.FAUNA_SECRET_KEY) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables.',
      }),
    };
  }

  // Initialize database (non-blocking, cached)
  initializeDatabase().catch(err => {
    console.error('[PROJECTS] Database initialization error (non-blocking):', err.message);
  });

  try {
    if (event.httpMethod === 'GET') {
      const projects = await getProjects();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          projects,
        }),
      };
    }

    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!isAdmin(authHeader)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized - Admin access required',
        }),
      };
    }

    if (event.httpMethod === 'POST') {
      const projectData = JSON.parse(event.body || '{}');
      
      if (!projectData.title || !projectData.description) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Title and description are required',
          }),
        };
      }

      try {
        const newProject = await createProject(projectData);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Project saved successfully',
            project: newProject,
          }),
        };
      } catch (dbError) {
        console.error('Error creating project:', dbError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to save project',
          }),
        };
      }
    }

    if (event.httpMethod === 'DELETE') {
      const projectId = event.path.split('/').pop();
      
      if (!projectId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Project ID is required',
          }),
        };
      }

      try {
        await deleteProject(projectId);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Project deleted successfully',
          }),
        };
      } catch (dbError) {
        if (dbError.message && dbError.message.includes('not found')) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Project not found',
            }),
          };
        }
        
        console.error('Error deleting project:', dbError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Failed to delete project',
          }),
        };
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed',
      }),
    };
  } catch (error) {
    console.error('Error in projects function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message,
      }),
    };
  }
};
