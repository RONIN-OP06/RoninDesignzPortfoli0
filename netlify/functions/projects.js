import '../_shared/env-loader.js'; // Load .env in local dev
import { getProjects, createProject, deleteProject, initializeDatabase, getMemberById } from './utils/database.js';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';

const ADMIN_EMAILS = ['ronindesignz123@gmail.com', 'roninsyoutub123@gmail.com'].map(e => e.toLowerCase().trim());

async function isAdmin(authHeader) {
  if (!authHeader) return false;
  try {
    const token = authHeader.replace('Bearer ', '');
    if (!token) return false;
    
    const member = await getMemberById(token);
    if (!member) return false;
    
    const memberEmail = member.email?.toLowerCase().trim();
    return ADMIN_EMAILS.includes(memberEmail);
  } catch {
    return false;
  }
}

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Check if database is configured
  if (!process.env.FAUNA_SECRET_KEY) {
    return errorResponse(
      'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables.',
      503
    );
  }

  // Initialize database (non-blocking, cached)
  initializeDatabase().catch(err => {
    console.error('[PROJECTS] Database initialization error (non-blocking):', err.message);
  });

  try {
    if (event.httpMethod === 'GET') {
      const projects = await getProjects();
      return successResponse({ projects }, 'Projects retrieved successfully');
    }

    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    const adminCheck = await isAdmin(authHeader);
    if (!adminCheck) {
      return errorResponse('Unauthorized - Admin access required', 401);
    }

    if (event.httpMethod === 'POST') {
      let projectData;
      try {
        projectData = event.body ? JSON.parse(event.body) : {};
      } catch (parseError) {
        return errorResponse('Invalid JSON in request body', 400);
      }
      
      if (!projectData.title || !projectData.description) {
        return errorResponse('Title and description are required', 400);
      }

      try {
        const newProject = await createProject(projectData);
        return successResponse({ project: newProject }, 'Project saved successfully', 201);
      } catch (dbError) {
        console.error('Error creating project:', dbError);
        return errorResponse('Failed to save project', 500);
      }
    }

    if (event.httpMethod === 'DELETE') {
      const projectId = event.path.split('/').pop();
      
      if (!projectId) {
        return errorResponse('Project ID is required', 400);
      }

      try {
        await deleteProject(projectId);
        return successResponse(null, 'Project deleted successfully');
      } catch (dbError) {
        if (dbError.message && dbError.message.includes('not found')) {
          return errorResponse('Project not found', 404);
        }
        
        console.error('Error deleting project:', dbError);
        return errorResponse('Failed to delete project', 500);
      }
    }

    return handleMethodNotAllowed(['GET', 'POST', 'DELETE']);
  } catch (error) {
    console.error('Error in projects function:', error);
    return errorResponse('Internal server error', 500, error);
  }
};
