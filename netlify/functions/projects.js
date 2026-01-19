import { readData, writeData, generateId } from './utils/db.js';

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

  try {
    if (event.httpMethod === 'GET') {
      const projects = readData('projects.json', []);
      
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

      const projects = readData('projects.json', []);

      const newProject = {
        id: generateId(),
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      projects.push(newProject);
      writeData('projects.json', projects);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Project saved successfully',
          project: newProject,
        }),
      };
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

      const projects = readData('projects.json', []);
      const filteredProjects = projects.filter(p => p.id !== projectId);

      if (projects.length === filteredProjects.length) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Project not found',
          }),
        };
      }

      writeData('projects.json', filteredProjects);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Project deleted successfully',
        }),
      };
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
