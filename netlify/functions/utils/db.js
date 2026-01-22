import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// For Netlify Functions, the filesystem is read-only except for /tmp
// Use /tmp in production (Netlify), and netlify/data in local development
function getDataDir() {
  // Check if we're running on Netlify (production)
  const isNetlify = !!(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
  
  if (isNetlify) {
    // In Netlify Functions, use /tmp for writable storage
    return '/tmp';
  }
  
  // In local development, use netlify/data directory
  const cwd = process.cwd();
  let projectRoot = cwd;
  
  // Remove any .netlify or functions-serve paths to get to project root
  if (cwd.includes('.netlify') || cwd.includes('functions-serve')) {
    const parts = cwd.split(/[/\\]/);
    const netlifyIndex = parts.findIndex(p => p === '.netlify' || p.includes('netlify'));
    if (netlifyIndex > 0) {
      projectRoot = join(...parts.slice(0, netlifyIndex));
    } else {
      const newIndex = parts.findIndex(p => p === 'new');
      if (newIndex >= 0) {
        projectRoot = join(...parts.slice(0, newIndex + 1));
      }
    }
  }
  
  return join(projectRoot, 'netlify', 'data');
}

const DATA_DIR = getDataDir();

// Ensure data directory exists
try {
  mkdirSync(DATA_DIR, { recursive: true });
} catch (error) {
  // Directory might already exist
}

function getFilePath(filename) {
  return join(DATA_DIR, filename);
}

export function readData(filename, defaultValue = []) {
  try {
    const filePath = getFilePath(filename);
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default value
      writeData(filename, defaultValue);
      return defaultValue;
    }
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

export function writeData(filename, data) {
  try {
    const filePath = getFilePath(filename);
    
    // Ensure directory exists before writing
    try {
      mkdirSync(DATA_DIR, { recursive: true });
    } catch (dirError) {
      // Directory might already exist, that's okay
      if (dirError.code !== 'EEXIST') {
        console.error(`Error creating directory ${DATA_DIR}:`, dirError);
      }
    }
    
    // Write the file
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    // Verify the write succeeded by reading it back
    try {
      const verifyData = readFileSync(filePath, 'utf8');
      JSON.parse(verifyData); // Ensure it's valid JSON
      return true;
    } catch (verifyError) {
      console.error(`Write verification failed for ${filename}:`, verifyError);
      return false;
    }
  } catch (error) {
    console.error(`Error writing ${filename} to ${DATA_DIR}:`, error);
    console.error(`Error details:`, {
      code: error.code,
      message: error.message,
      path: getFilePath(filename),
      dataDir: DATA_DIR,
      isNetlify: !!(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME)
    });
    return false;
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
