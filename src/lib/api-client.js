// API client for backend communication
import { CONFIG } from './config';

function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isProduction) {
      return window.location.origin + '/.netlify/functions';
    }
  }
  
  return 'http://localhost:3000/api';
}

export class ApiClient {
  constructor() {
    this._baseUrl = null;
  }

  get baseUrl() {
    if (!this._baseUrl) {
      this._baseUrl = getApiBaseUrl();
    }
    return this._baseUrl;
  }

  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    // grab token from storage if it exists
    const storedUser = localStorage.getItem('user');
    let authToken = null;
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        authToken = user.id; // using user id as token for now
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // add auth header if we have a token
    if (authToken) {
      defaultOptions.headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      });

      // sometimes responses aren't json, gotta handle that
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          return { 
            success: false, 
            message: text || `Server error: ${response.status} ${response.statusText}` 
          };
        }
      }
      
      if (!response.ok) {
        return { success: false, message: data.error || data.message || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('API request error:', error);
      if (error.message === 'Failed to fetch') {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please make sure the backend server is running on port 3000.' 
        };
      }
      return { success: false, message: error.message || 'Network error' };
    }
  }

  async registerMember(memberData) {
    return this._request(CONFIG.API.ENDPOINTS.MEMBERS, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async getMembers() {
    return this._request(CONFIG.API.ENDPOINTS.MEMBERS, {
      method: 'GET',
    });
  }

  async login(credentials) {
    return this._request(CONFIG.API.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async sendContactMessage(contactData) {
    return this._request(CONFIG.API.ENDPOINTS.CONTACT, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async getAllMessages() {
    return this._request(CONFIG.API.ENDPOINTS.MESSAGES, {
      method: 'GET',
    });
  }

  async getProjects() {
    return this._request(CONFIG.API.ENDPOINTS.PROJECTS, {
      method: 'GET',
    });
  }

  async saveProject(projectData) {
    return this._request(CONFIG.API.ENDPOINTS.PROJECTS, {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId) {
    return this._request(`${CONFIG.API.ENDPOINTS.PROJECTS}/${projectId}`, {
      method: 'DELETE',
    });
  }

  async uploadFile(file, category) {
    const url = `${this.baseUrl}${CONFIG.API.ENDPOINTS.UPLOAD}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const storedUser = localStorage.getItem('user');
    let authToken = null;
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        authToken = user.id;
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`
        } : {},
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, message: error.error || 'Upload failed' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: error.message || 'Network error' };
    }
  }
}

// Export a singleton instance for better performance
export const apiClient = new ApiClient();


