# Netlify Backend Setup Guide

This project uses Netlify Functions to host the backend server and JSON files for the database.

## Structure

```
netlify/
├── functions/
│   ├── utils/
│   │   └── db.js          # Database utility functions
│   ├── members.js         # Member registration and retrieval
│   ├── login.js           # User authentication
│   ├── contact.js         # Contact form submissions
│   ├── messages.js        # Admin message management
│   ├── projects.js        # Project CRUD operations
│   └── upload.js          # File upload handling
└── data/                  # JSON database files (auto-created)
    ├── members.json
    ├── messages.json
    └── projects.json
```

## API Endpoints

All endpoints are available at `/.netlify/functions/{function-name}` or `/api/{function-name}` (via redirect)

### Members
- `GET /api/members` - Get all members (passwords excluded)
- `POST /api/members` - Register a new member

### Authentication
- `POST /api/login` - Login with email and password

### Contact
- `POST /api/contact` - Send a contact message

### Messages (Admin Only)
- `GET /api/messages` - Get all messages
- `PUT /api/messages` - Update message read status

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project (Admin only)
- `DELETE /api/projects/:id` - Delete a project (Admin only)

### Upload
- `POST /api/upload` - Upload a file (Admin only)

## Database

The database uses JSON files stored in `netlify/data/`:
- `members.json` - User accounts
- `messages.json` - Contact form messages
- `projects.json` - Portfolio projects

**Note:** In production, consider using a proper database service like:
- Netlify's built-in database
- FaunaDB
- Supabase
- MongoDB Atlas

## Deployment

1. **Connect to Netlify:**
   - Push your code to GitHub
   - Connect your repository to Netlify
   - Netlify will automatically detect the `netlify.toml` configuration

2. **Environment Variables (Optional):**
   - Set `VITE_ADMIN_EMAILS` in Netlify dashboard if you want to customize admin emails
   - Default: `ronindesignz123@gmail.com,roninsyoutub123@gmail.com`

3. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

## Local Development

To test Netlify Functions locally:

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Run locally:
   ```bash
   netlify dev
   ```

This will:
- Start the frontend dev server
- Start Netlify Functions locally
- Proxy API requests to functions

## Database Persistence

**Important:** JSON files in `netlify/data/` are stored in the function's file system. For production, consider:

1. **Netlify's Database** - Built-in database service
2. **External Database** - Use a service like FaunaDB, Supabase, or MongoDB
3. **Netlify KV** - Key-value store for simple data

The current implementation works for development and small-scale production, but for larger applications, migrate to a proper database.

## Security Notes

- Passwords are hashed using bcryptjs
- Admin authentication is simplified - implement proper JWT tokens for production
- CORS is enabled for all origins - restrict in production
- File uploads return placeholder URLs - implement proper storage in production
