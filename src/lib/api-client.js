import { CONFIG } from './config';

function getBaseUrl() {
  // IGNORE VITE_API_BASE_URL if it points to old backend - always use Netlify Functions
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('ronindesignz-backend') && !envUrl.includes('onrender')) {
    // Only use env URL if it's not the old backend
    return envUrl;
  }
  
  if (typeof window !== 'undefined') {
    // Always use Netlify Functions - works in both dev and production
    // If running netlify dev, it will be http://localhost:8888/.netlify/functions
    // If running vite dev, it will be http://localhost:5173/.netlify/functions (needs netlify dev)
    // In production, it will be the actual domain/.netlify/functions
    const origin = window.location.origin;
    
    // Always use Netlify Functions - ignore any old backend URLs
    return origin + '/.netlify/functions';
  }
  
  // Fallback - should not reach here in browser
  return '/.netlify/functions';
}

function getAuthToken() {
  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      return user.id || null;
    }
  } catch {
    return null;
  }
  return null;
}

async function request(endpoint, options = {}) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Optimized timeout - reduced from 30s to 10s for faster failure detection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let responseData;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { error: text || 'Invalid response' };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || responseData.error || `Request failed: ${response.status}`,
        data: null,
      };
    }

    return {
      success: true,
      data: responseData,
      message: responseData.message || 'Success',
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout. Please try again.',
        data: null,
      };
    }
    console.error('[API ERROR]', error);
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection.',
      data: null,
    };
  }
}

export class ApiClient {
  async registerMember(memberData) {
    return request(CONFIG.API.ENDPOINTS.MEMBERS, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async getMembers() {
    return request(CONFIG.API.ENDPOINTS.MEMBERS, {
      method: 'GET',
    });
  }

  async login(credentials) {
    return request(CONFIG.API.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async sendContactMessage(contactData) {
    return request(CONFIG.API.ENDPOINTS.CONTACT, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async getAllMessages() {
    return request(CONFIG.API.ENDPOINTS.MESSAGES, {
      method: 'GET',
    });
  }

  async getProjects() {
    return request(CONFIG.API.ENDPOINTS.PROJECTS, {
      method: 'GET',
    });
  }

  async saveProject(projectData) {
    return request(CONFIG.API.ENDPOINTS.PROJECTS, {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId) {
    return request(`${CONFIG.API.ENDPOINTS.PROJECTS}/${projectId}`, {
      method: 'DELETE',
    });
  }

  async uploadFile(file, category) {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${CONFIG.API.ENDPOINTS.UPLOAD}`;
    const token = getAuthToken();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        return { success: false, message: error.error || 'Upload failed', data: null };
      }

      const data = await response.json();
      return { success: true, data, message: 'Upload successful' };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: error.message || 'Upload failed', data: null };
    }
  }
}

export const apiClient = new ApiClient();
