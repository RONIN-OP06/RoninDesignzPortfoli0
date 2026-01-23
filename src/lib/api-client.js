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

  // Best practice: Retry logic with exponential backoff
  const maxRetries = 3;
  let lastError;
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:53',message:'Retry loop start',data:{maxRetries,endpoint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I2'})}).catch(()=>{});
  // #endregion
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:58',message:'API request attempt',data:{attempt:attempt+1,maxRetries,endpoint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I2'})}).catch(()=>{});
      // #endregion
      
      // Best practice: Timeout for API requests - 30 seconds for database operations
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

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

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:85',message:'API response received',data:{status:response.status,ok:response.ok,attempt:attempt+1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I2'})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        // Check if it's a retryable error (5xx) or non-retryable (4xx)
        const isRetryable = response.status >= 500;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:88',message:'API error response',data:{status:response.status,isRetryable,attempt:attempt+1,maxRetries},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I2'})}).catch(()=>{});
        // #endregion
        
        // Retry on 5xx errors (server errors), don't retry on 4xx (client errors)
        if (isRetryable && attempt < maxRetries - 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:93',message:'Retrying on 5xx error',data:{status:response.status,delay,attempt:attempt+1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I2'})}).catch(()=>{});
          // #endregion
          console.log(`[API] Retry ${attempt + 1}/${maxRetries} after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // Non-retryable error (4xx) or all retries exhausted
        return {
          success: false,
          message: responseData.message || responseData.error || `Request failed: ${response.status}`,
          data: null,
        };
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:105',message:'API request success',data:{attempt:attempt+1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I2'})}).catch(()=>{});
      // #endregion

      return {
        success: true,
        data: responseData,
        message: responseData.message || 'Success',
      };
    } catch (error) {
      lastError = error;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:115',message:'API request exception',data:{error:error.name,message:error.message,attempt:attempt+1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I2'})}).catch(()=>{});
      // #endregion
      
      // Best practice: Don't retry on certain errors
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timeout. Please try again.',
          data: null,
        };
      }
      
      // Best practice: Retry on network errors, not on client errors
      if (attempt < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff, max 5s
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:123',message:'Retrying on network error',data:{delay,attempt:attempt+1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I2'})}).catch(()=>{});
        // #endregion
        console.log(`[API] Retry ${attempt + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // All retries exhausted or non-retryable error
      console.error('[API ERROR]', error);
      return {
        success: false,
        message: error.message || 'Network error. Please check your connection.',
        data: null,
      };
    }
  }
  
  // Fallback (should not reach here)
  return {
    success: false,
    message: lastError?.message || 'Request failed after retries',
    data: null,
  };
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:124',message:'API login request start',data:{hasEmail:!!credentials.email,hasPassword:!!credentials.password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    const requestStart = Date.now();
    const result = await request(CONFIG.API.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const requestTime = Date.now() - requestStart;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api-client.js:130',message:'API login response',data:{success:result.success,requestTime,hasData:!!result.data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    return result;
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
