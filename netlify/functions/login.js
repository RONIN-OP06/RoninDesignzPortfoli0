import '../_shared/env-loader.js'; // Load .env in local dev
import { getMemberByEmail, updateMember, initializeDatabase } from './utils/database.js';
import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, sanitizeInput } from './utils/validation.js';
import { successResponse, errorResponse, handleOptions, handleMethodNotAllowed } from './utils/response.js';
import { writeFile, appendFile } from 'fs/promises';
import { join } from 'path';

// Debug logging helper
async function debugLog(location, message, data, hypothesisId) {
  const logEntry = JSON.stringify({
    location,
    message,
    data,
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId
  }) + '\n';
  
  try {
    // Try HTTP logging first
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/f26247a0-1bd1-4fa3-8fe2-07566382e1ba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, message, data, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId })
      }).catch(() => {});
    }
    
    // Also write to file as fallback
    const logPath = join(process.cwd(), '.cursor', 'debug.log');
    await appendFile(logPath, logEntry).catch(() => {});
  } catch (err) {
    // Silent fail - don't break the app
  }
}

// Admin emails - PRIORITY: Admin login takes priority
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'ronindesignz123@gmail.com,roninsyoutub123@gmail.com')
  .split(',')
  .map(e => e.trim().toLowerCase());

export const handler = async (event, context) => {
  await debugLog('login.js:11', 'Login handler called', { method: event.httpMethod, hasBody: !!event.body }, 'A');

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return handleMethodNotAllowed(['POST']);
  }

  // Check if database is configured
  const hasFaunaKey = !!process.env.FAUNA_SECRET_KEY;
  await debugLog('login.js:25', 'Database config check', { hasFaunaKey, keyLength: process.env.FAUNA_SECRET_KEY?.length || 0 }, 'A');

  if (!hasFaunaKey) {
    console.error('[LOGIN] FAUNA_SECRET_KEY not configured');
    return errorResponse(
      'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables. See FAUNA_SETUP.md for instructions.',
      503
    );
  }

  // Initialize database - wait for it to ensure it's ready
  try {
    await initializeDatabase();
    await debugLog('login.js:70', 'Database initialized', {}, 'B');
  } catch (err) {
    console.error('[LOGIN] Database initialization error:', err.message);
    await debugLog('login.js:73', 'Database init error', { error: err.message }, 'B');
    // Continue anyway - might work if already initialized
  }

  try {
    // Parse and validate request body
    let body;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      await debugLog('login.js:42', 'JSON parse error', { error: parseError.message }, 'A');
      return errorResponse('Invalid JSON in request body', 400);
    }

    const { email, password } = body;
    await debugLog('login.js:46', 'Request body parsed', { hasEmail: !!email, hasPassword: !!password, emailLength: email?.length || 0 }, 'A');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return errorResponse(emailValidation.message, 400);
    }

    // Validate password
    if (!password || typeof password !== 'string') {
      return errorResponse('Password is required', 400);
    }

    // Sanitize email
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // PRIORITY: Check if admin email first (admin login takes priority)
    const isAdminEmail = ADMIN_EMAILS.includes(sanitizedEmail);
    console.log(`[LOGIN ATTEMPT] Email: ${sanitizedEmail}, IsAdminEmail: ${isAdminEmail}`);

    // Best practice: Get member from database with retry logic
    let member;
    let retries = 0;
    const maxRetries = 3;
    
    // #region agent log
    await debugLog('login.js:110', 'Retry loop start', { maxRetries, email: sanitizedEmail }, 'I1');
    // #endregion
    
    while (retries < maxRetries) {
      try {
        const attemptNum = retries + 1;
        // #region agent log
        await debugLog('login.js:117', 'Database query attempt', { attempt: attemptNum, maxRetries }, 'I1');
        // #endregion
        
        console.log(`[LOGIN] Fetching member from database... (attempt ${attemptNum}/${maxRetries})`);
        member = await getMemberByEmail(sanitizedEmail);
        console.log(`[LOGIN] Member found: ${member ? 'YES' : 'NO'}`);
        
        // #region agent log
        await debugLog('login.js:120', 'Database query success', { attempt: attemptNum, memberFound: !!member }, 'I1');
        // #endregion
        
        break; // Success, exit retry loop
      } catch (dbError) {
        retries++;
        // #region agent log
        await debugLog('login.js:122', 'Database query error', { attempt: retries, maxRetries, error: dbError.message }, 'I1');
        // #endregion
        
        console.error(`[LOGIN] Database error (attempt ${retries}/${maxRetries}):`, dbError.message);
        
        // Best practice: Don't retry on configuration errors
        if (dbError.message && (dbError.message.includes('Database not configured') || dbError.message.includes('Invalid FAUNA_SECRET_KEY'))) {
          // #region agent log
          await debugLog('login.js:126', 'Configuration error - no retry', { error: dbError.message }, 'I1');
          // #endregion
          return errorResponse(
            'Database not configured. Please set FAUNA_SECRET_KEY in Netlify environment variables. Get your key from https://dashboard.fauna.com/',
            503
          );
        }
        
        // Best practice: Retry on transient errors
        if (retries < maxRetries) {
          const delay = 1000 * retries; // Exponential backoff
          // #region agent log
          await debugLog('login.js:135', 'Retry scheduled', { retries, maxRetries, delay }, 'I1');
          // #endregion
          console.log(`[LOGIN] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // All retries exhausted
          // #region agent log
          await debugLog('login.js:140', 'All retries exhausted', { retries, maxRetries }, 'I1');
          // #endregion
          console.error('[LOGIN] All retry attempts failed');
          return errorResponse('Database error. Please try again in a moment.', 503);
        }
      }
    }

    if (!member) {
      // Don't reveal if email exists for security
      return errorResponse('Invalid email or password', 401);
    }

    // Verify password
    let passwordMatch = false;
    const passwordCheckStart = Date.now();
    try {
      // Check if password is hashed (starts with $2)
      const isHashed = member.password && member.password.startsWith('$2');
      await debugLog('login.js:92', 'Password verification start', { isHashed, hasPassword: !!member.password }, 'D');

      if (isHashed) {
        // Password is hashed, use bcrypt.compare
        passwordMatch = await bcrypt.compare(password, member.password);
        await debugLog('login.js:96', 'Bcrypt compare result', { passwordMatch, checkTime: Date.now() - passwordCheckStart }, 'D');
      } else {
        // Legacy plaintext password - compare directly and upgrade
        passwordMatch = member.password === password;
        await debugLog('login.js:101', 'Plaintext password check', { passwordMatch }, 'D');
        
        if (passwordMatch) {
          // Upgrade plaintext password to hashed
          const hashedPassword = await bcrypt.hash(password, 10);
          try {
            await updateMember(member.id, { password: hashedPassword });
            console.log(`[PASSWORD UPGRADE] Upgraded plaintext password for ${member.email}`);
          } catch (updateError) {
            console.error('Error upgrading password:', updateError);
            // Continue with login even if upgrade fails
          }
        }
      }
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      await debugLog('login.js:116', 'Bcrypt error', { error: bcryptError.message }, 'D');
      return errorResponse('Authentication error', 500);
    }

    if (!passwordMatch) {
      return errorResponse('Invalid email or password', 401);
    }

    // Determine admin status (PRIORITY: Admin takes priority)
    // Double-check for reliability - ensures admin status is correct every time
    const memberEmailLower = member.email.toLowerCase();
    const isAdmin = isAdminEmail || ADMIN_EMAILS.includes(memberEmailLower);
    
    // Log admin check for debugging (can be removed in production)
    if (isAdmin) {
      console.log(`[ADMIN CHECK] Email: ${memberEmailLower}, isAdminEmail: ${isAdminEmail}, memberEmailMatch: ${ADMIN_EMAILS.includes(memberEmailLower)}`);
    }
    await debugLog('login.js:128', 'Admin status determination', { memberEmailLower, isAdminEmail, isAdmin, adminEmailsMatch: ADMIN_EMAILS.includes(memberEmailLower) }, 'E');

    // Remove password from response
    const { password: _, ...safeMember } = member;

    // Prepare response data
    const memberData = {
      ...safeMember,
      isAdmin, // Include isAdmin in member object
    };

    // Log successful login (admin priority) with detailed info
    if (isAdmin) {
      console.log(`[ADMIN LOGIN SUCCESS] Email: ${member.email}, ID: ${member.id}, isAdmin: ${isAdmin}`);
    } else {
      console.log(`[USER LOGIN SUCCESS] Email: ${member.email}, ID: ${member.id}`);
    }

    await debugLog('login.js:151', 'Login success response', { memberId: memberData.id, isAdmin }, 'E');

    return successResponse(
      {
        member: memberData,
        isAdmin,
      },
      'Login successful'
    );
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    await debugLog('login.js:162', 'Login handler error', { error: error.message, stack: error.stack }, 'A');
    return errorResponse('Internal server error', 500, error);
  }
};
