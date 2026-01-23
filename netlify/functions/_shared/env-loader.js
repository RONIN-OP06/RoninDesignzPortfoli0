/**
 * Environment variable loader for Netlify Functions
 * Loads .env file in local development
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

let envLoaded = false;

export function loadEnv() {
  if (envLoaded) return;
  
  // Only load in local development (not in Netlify production)
  if (!process.env.NETLIFY && process.env.NODE_ENV !== 'production') {
    const envPath = join(process.cwd(), '.env');
    
    if (existsSync(envPath)) {
      try {
        const envContent = readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          // Skip comments and empty lines
          if (!trimmed || trimmed.startsWith('#')) continue;
          
          // Parse KEY=VALUE format
          const equalIndex = trimmed.indexOf('=');
          if (equalIndex > 0) {
            const key = trimmed.substring(0, equalIndex).trim();
            let value = trimmed.substring(equalIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            
            // Only set if not already set (env vars take precedence)
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
        
        console.log('[ENV] Loaded environment variables from .env file');
        envLoaded = true;
      } catch (error) {
        console.error('[ENV] Error loading .env file:', error.message);
      }
    } else {
      console.log('[ENV] No .env file found, using system environment variables');
    }
  }
  
  envLoaded = true;
}

// Auto-load on import
loadEnv();
