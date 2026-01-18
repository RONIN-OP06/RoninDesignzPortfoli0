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

export const CONFIG = {
  API: {
    BASE_URL: getApiBaseUrl(),
    ENDPOINTS: {
      MEMBERS: '/members',
      LOGIN: '/login',
      CONTACT: '/contact',
      MESSAGES: '/messages',
      PROJECTS: '/projects',
      UPLOAD: '/upload'
    }
  },
  
  THREEJS: {
    CAMERA: {
      FOV: 75,
      NEAR: 0.1,
      FAR: 1000,
      INITIAL_Z: 3
    },
    CUBE: {
      SIZE: 1,
      INITIAL_POSITION: { x: 0, y: -1.5, z: 0 },
      ROTATION_SPEED: 0.01,
      COLOR: 0x00ff00,
      MIN_SCALE: 0.5,
      SCALE_MULTIPLIER: 2,
      POSITION_MULTIPLIER: 3
    },
    SCENE: {
      BACKGROUND_COLOR: 0x1a1a1a
    }
  },
  
  VALIDATION: {
    PASSWORD: {
      MIN_LENGTH: 8,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBER: true
    },
    PHONE: {
      LENGTH: 10
    },
    NAME: {
      MIN_LENGTH: 2
    },
    EMAIL: {
      ALLOWED_DOMAINS: ['gmail.com', 'yahoo.com', 'hotmail.com']
    }
  },
  
  MESSAGES: {
    SUBMITTING: 'Submitting...',
    SUCCESS_PREFIX: 'Form submitted successfully! Welcome to RoninDezigns,',
    ERROR_CONNECTION: 'Error connecting to server. Please make sure the backend server is running on port 3000.',
    ERROR_VALIDATION: 'Please fix all errors before submitting.'
  },
  
  ADMIN: {
    EMAILS: (import.meta.env.VITE_ADMIN_EMAILS || 'ronindesignz123@gmail.com,roninsyoutub123@gmail.com').split(',').map(e => e.trim().toLowerCase())
  }
};


