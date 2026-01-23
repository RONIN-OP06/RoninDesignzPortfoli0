// Standardized response helpers for Netlify Functions
// Best practice: Centralized response handling with proper error types

export function createResponse(statusCode, data, headers = {}) {
  // Best practice: Always set proper CORS headers
  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  };

  // Best practice: Validate status code
  if (statusCode < 100 || statusCode >= 600) {
    console.error('[RESPONSE] Invalid status code:', statusCode);
    statusCode = 500;
  }

  // Best practice: Safe JSON stringification
  let body;
  try {
    body = typeof data === 'string' ? data : JSON.stringify(data);
  } catch (error) {
    console.error('[RESPONSE] JSON stringification error:', error);
    body = JSON.stringify({ error: 'Response serialization failed' });
    statusCode = 500;
  }

  return {
    statusCode,
    headers: defaultHeaders,
    body,
  };
}

export function successResponse(data, message = 'Success', statusCode = 200) {
  return createResponse(statusCode, {
    success: true,
    message,
    data,
  });
}

export function errorResponse(message, statusCode = 400, error = null) {
  const response = {
    success: false,
    message,
  };
  
  if (error && process.env.NODE_ENV === 'development') {
    response.error = error.message;
  }
  
  return createResponse(statusCode, response);
}

export function handleOptions() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
    body: '',
  };
}

export function handleMethodNotAllowed(allowedMethods = ['GET', 'POST']) {
  return errorResponse(
    `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
    405
  );
}
