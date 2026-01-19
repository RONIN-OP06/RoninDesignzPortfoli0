import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// For Netlify Functions, use process.cwd() which points to the project root
// This works reliably in both development and production
const DATA_DIR = join(process.cwd(), 'netlify', 'data');

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
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
