import { loadProjects, authenticateUser, isAdminUser, getProjectsFile } from './_shared/utils.js';
import fs from 'fs/promises';

export async function handler(event, context) {
  if (event.httpMethod === 'GET') {
    try {
      const projects = await loadProjects();
      return {
        statusCode: 200,
        body: JSON.stringify(projects)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to read projects' })
      };
    }
  }

  if (event.httpMethod === 'POST') {
    const authResult = await authenticateUser(event);
    if (authResult.error) {
      return {
        statusCode: authResult.statusCode,
        body: JSON.stringify({ error: authResult.error })
      };
    }

    const { user } = authResult;
    if (!isAdminUser(user.email)) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Only administrators can manage projects' })
      };
    }

    try {
      const projectData = JSON.parse(event.body || '{}');
      let projects = await loadProjects();

      if (projectData.id) {
        const index = projects.findIndex(p => p.id === parseInt(projectData.id));
        if (index !== -1) {
          projects[index] = { ...projects[index], ...projectData, id: parseInt(projectData.id) };
        } else {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Project not found' })
          };
        }
      } else {
        const newId = Math.max(...projects.map(p => p.id), 0) + 1;
        projects.push({ ...projectData, id: newId });
      }

      const newContent = `export const projects = ${JSON.stringify(projects, null, 2)}

const projectMap = new Map()
projects.forEach(p => projectMap.set(p.id, p))

export function getProjectById(id) {
  return projectMap.get(parseInt(id)) || projects.find(project => project.id === parseInt(id))
}
`;

      await fs.writeFile(getProjectsFile(), newContent, 'utf8');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Project saved successfully',
          project: projectData.id ? projects.find(p => p.id === parseInt(projectData.id)) : projects[projects.length - 1]
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save project' })
      };
    }
  }

  if (event.httpMethod === 'DELETE') {
    const authResult = await authenticateUser(event);
    if (authResult.error) {
      return {
        statusCode: authResult.statusCode,
        body: JSON.stringify({ error: authResult.error })
      };
    }

    const { user } = authResult;
    if (!isAdminUser(user.email)) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Only administrators can delete projects' })
      };
    }

    try {
      const pathParts = event.path.split('/').filter(p => p);
      const projectId = parseInt(pathParts[pathParts.length - 1] || '0');
      if (!projectId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Project ID is required' })
        };
      }

      let projects = await loadProjects();
      projects = projects.filter(p => p.id !== projectId);

      const newContent = `export const projects = ${JSON.stringify(projects, null, 2)}

const projectMap = new Map()
projects.forEach(p => projectMap.set(p.id, p))

export function getProjectById(id) {
  return projectMap.get(parseInt(id)) || projects.find(project => project.id === parseInt(id))
}
`;

      await fs.writeFile(getProjectsFile(), newContent, 'utf8');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Project deleted successfully' })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to delete project' })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}
