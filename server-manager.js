/**
 * Server Manager
 * Ensures server is running and manages restarts
 * Best practice: Automated server lifecycle management
 */

const { spawn, exec } = require('child_process');
const http = require('http');

const SERVER_URL = 'http://localhost:8888';
const HEALTH_CHECK_INTERVAL = 10000; // 10 seconds
const MAX_RESTART_ATTEMPTS = 5;

let serverProcess = null;
let restartAttempts = 0;

// Best practice: Health check function
function checkServerHealth() {
  return new Promise((resolve) => {
    const req = http.get(`${SERVER_URL}/.netlify/functions/test-fauna`, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Best practice: Start server with error handling
function startServer() {
  if (serverProcess) {
    console.log('⚠️  Server process already exists');
    return;
  }
  
  console.log('🚀 Starting Netlify dev server...');
  
  serverProcess = spawn('npm', ['run', 'dev:netlify'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
    serverProcess = null;
  });
  
  serverProcess.on('exit', (code) => {
    console.log(`⚠️  Server exited with code ${code}`);
    serverProcess = null;
    
    if (restartAttempts < MAX_RESTART_ATTEMPTS) {
      restartAttempts++;
      console.log(`🔄 Restarting server (attempt ${restartAttempts}/${MAX_RESTART_ATTEMPTS})...`);
      setTimeout(startServer, 5000);
    } else {
      console.error('❌ Max restart attempts reached');
    }
  });
}

// Best practice: Monitor and maintain server
async function monitorServer() {
  console.log('👀 Starting server monitor...\n');
  
  startServer();
  
  // Wait for initial startup
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  setInterval(async () => {
    const healthy = await checkServerHealth();
    
    if (!healthy && !serverProcess) {
      console.log('⚠️  Server not responding and no process - restarting...');
      restartAttempts = 0;
      startServer();
    } else if (!healthy) {
      console.log('⚠️  Server not responding but process exists - monitoring...');
    }
  }, HEALTH_CHECK_INTERVAL);
}

// Start monitoring
if (require.main === module) {
  monitorServer().catch(console.error);
}

module.exports = { startServer, checkServerHealth, monitorServer };
