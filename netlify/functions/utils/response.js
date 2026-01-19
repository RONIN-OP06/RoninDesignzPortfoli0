// Standardized response helpers for Netlify Functions

export function createResponse(statusCode, data, headers = {}) {
  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    ...headers,
  };

  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify(data),
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
  return createResponse(200, '');
}

export function handleMethodNotAllowed(allowedMethods = ['GET', 'POST']) {
  return errorResponse(
    `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
    405
  );
}
