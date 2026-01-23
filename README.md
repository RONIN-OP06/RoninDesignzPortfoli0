# 🎨 RoninDesignz Portfolio

<div align="center">

![Status](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![License](https://img.shields.io/badge/License-Proprietary-red)

A modern, full-stack portfolio website showcasing web development, UI/UX design, 3D modeling, and software engineering capabilities.

[Features](#-key-features) • [Installation](#-getting-started) • [Documentation](#-documentation) • [Security](#-security-features)

</div>

---

## 🌟 Overview

This portfolio website serves as a comprehensive showcase of my work across multiple disciplines including web development, UI/UX design, 3D design, and software engineering. The application features an interactive project gallery, secure user authentication, and an admin dashboard for managing client inquiries.

### What Makes This Project Special

This project demonstrates a complete full-stack implementation with enterprise-grade security measures and modern UI/UX design. Built with performance and user experience in mind, it showcases professional development practices and attention to detail.

Key highlights include:

- ✨ **Full-Stack Implementation** - Complete React frontend with Express.js backend
- 🔒 **Enterprise-Grade Security** - Comprehensive security measures and best practices
- 🎨 **Modern UI/UX** - Beautiful, responsive design with 3D visualizations
- 📱 **Mobile-First** - Optimized for all devices and screen sizes
- ⚡ **Performance Optimized** - Fast loading times and smooth interactions

---

## 🖼️ Interactive Portfolio Gallery

The portfolio gallery is the centerpiece of this application, allowing visitors to browse through projects across different categories. It supports multiple media types including images, videos, and embedded content. Users can filter projects by category such as Web Development, UI/UX Design, 3D Design, and more.

Key features include:

- **Multi-Media Support** - Browse projects with images, videos, and embedded content
- **Category Filtering** - Filter projects by category (Web Development, UI/UX, 3D Design, etc.)
- **Responsive Design** - Optimized for all screen sizes from mobile to desktop
- **Smooth Navigation** - Intuitive browsing with thumbnail navigation and keyboard controls

## 🔐 User Authentication

The authentication system provides secure user registration and login functionality. Passwords are hashed using bcrypt with 10 salt rounds, ensuring that sensitive user data is protected. The system uses token-based authentication for session management.

Features include:

- **Secure Signup/Login** - Password hashing with bcrypt (10 salt rounds)
- **Session Management** - Token-based authentication system
- **Role-Based Access** - Admin users have access to message management dashboard

## 📊 Admin Dashboard

Administrators have access to a dedicated dashboard for managing contact form submissions. This allows for efficient communication with potential clients and project inquiries.

The dashboard provides:

- **Message Management** - View and manage all contact form submissions
- **User Details** - Access sender information and contact details
- **Quick Actions** - Direct email links for easy communication

## 🎨 Modern UI/UX

The user interface features a professional dark theme with modern design elements. Three.js integration provides engaging 3D visualizations on authentication pages, while parallax effects create an immersive experience on the homepage.

Design features include:

- **Dark Theme** - Professional dark mode interface
- **3D Visualizations** - Three.js integration on authentication pages
- **Parallax Effects** - Engaging scroll animations on homepage
- **Glassmorphism** - Modern glassmorphic design elements
- **Responsive Layout** - Mobile-first design approach

---

## 🛠️ Frontend Technology Stack

The frontend is built with React 18, utilizing modern hooks and component architecture. React Router v6 handles client-side routing, while Vite provides fast development and build tooling. Tailwind CSS offers utility-first styling, and Shadcn UI provides high-quality, accessible components.

Technologies used:

- **React 18** - Modern UI library with hooks for component-based development
- **React Router v6** - Client-side routing for single-page application navigation
- **Vite** - Fast build tool and development server with hot module replacement
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn UI** - High-quality, accessible component library built on Radix UI
- **Three.js** - Powerful 3D graphics library for creating immersive visualizations
- **Lucide React** - Beautiful, consistent icon library

## ⚙️ Backend Technology Stack

The backend is built with **Netlify Functions** (serverless), providing a scalable and cost-effective serverless architecture. The backend is fully integrated with the frontend on Netlify, ensuring seamless communication between frontend and backend. Security is a top priority, with multiple layers of protection including password hashing, input validation, and CORS handling.

Backend technologies:

- **Netlify Functions** - Serverless functions for scalable backend API
- **FaunaDB** - Serverless, flexible, transactional database for persistent data storage
- **bcryptjs** - Pure JavaScript password hashing library (serverless-compatible)
- **Express.js** - Available for local development server

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - JavaScript runtime environment
- **npm** or **yarn** - Package manager for installing dependencies

## 📦 Installation

Follow these steps to set up the project on your local machine:

#### 1. Clone the repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/RONIN-OP06/RoninDesignzPortfoli0.git
cd RoninDesignzPortfoli0
```

#### 2. Install dependencies

Install all required dependencies using npm:

```bash
npm install
```

This will install all frontend and backend dependencies listed in `package.json`.

#### 3. Configure environment variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000
ADMIN_EMAILS=your-admin-email@example.com
FAUNA_SECRET_KEY=your-fauna-secret-key
```

Replace `your-admin-email@example.com` with your actual admin email address. You can add multiple admin emails by separating them with commas.

**Important:** For database functionality, you need to set up FaunaDB. See [FAUNA_SETUP.md](./FAUNA_SETUP.md) for detailed instructions. The `FAUNA_SECRET_KEY` is required for the application to work properly.

#### 4. Start the development server

For local development with Netlify Functions:

```bash
npm run dev:netlify
```

This starts the Netlify Dev server which runs both frontend and backend functions locally.

Alternatively, for Vite-only development:

```bash
npm run dev
```

This starts the Vite development server on port 5173. Note: API calls will use Netlify Functions in production, or you can run a local Express server with `npm start` for full local development.

#### 5. Access the application

Once the server is running, you can access the application:

- **Frontend**: http://localhost:5173 (Vite) or http://localhost:8888 (Netlify Dev)
- **Backend API**: http://localhost:8888/.netlify/functions (Netlify Dev) or http://localhost:3000/api (Express)

---

## 🏗️ Project Structure

The project follows an atomic design pattern, organizing components from smallest to largest. This structure makes the codebase maintainable and scalable.

```
ronindesignz/
├── src/
│   ├── components/
│   │   ├── atoms/          # Basic UI components (buttons, inputs, etc.)
│   │   ├── molecules/      # Simple component groups (form fields, etc.)
│   │   ├── organisms/      # Complex feature components (forms, galleries, etc.)
│   │   ├── templates/      # Page-level components (HomePage, PortfolioPage, etc.)
│   │   └── ui/             # Shadcn UI components
│   ├── lib/                # Utilities and business logic
│   ├── contexts/           # React contexts for global state
│   ├── data/               # Static data files
│   └── App.jsx             # Main application component
├── server.js               # Express backend server
├── public/                 # Static assets (images, videos, etc.)
└── package.json            # Project dependencies
```

---

## 📄 Available Scripts

The project includes several npm scripts for development and production:

- **`npm run dev`** - Starts the Vite development server with hot module replacement
- **`npm run build`** - Creates an optimized production build in the `dist/` directory
- **`npm run preview`** - Previews the production build locally
- **`npm start`** - Starts the Express.js backend server

---

## 🔐 Security Features

This application implements comprehensive security measures following industry best practices. Security was a priority from the initial design phase, with multiple layers of protection to safeguard user data and prevent common web vulnerabilities.

Implemented security features:

- **Password Hashing** - All passwords are hashed using bcrypt with 10 salt rounds, ensuring that even if the database is compromised, passwords remain secure
- **Rate Limiting** - API endpoints are protected with rate limiting to prevent brute force attacks and denial of service attempts
- **Security Headers** - Helmet.js is configured to set various HTTP security headers, protecting against XSS attacks, clickjacking, and MIME type sniffing
- **Input Validation** - Both client-side and server-side validation ensure that all user inputs are properly sanitized and validated before processing
- **CSRF Protection** - Token-based CSRF protection prevents cross-site request forgery attacks
- **CORS Configuration** - Cross-origin resource sharing is properly configured to restrict unauthorized access
- **Authentication** - Secure token-based authentication system ensures only authorized users can access protected resources
- **Role-Based Access** - Admin-only routes are protected, ensuring that only authorized administrators can access sensitive functionality

For detailed security information, implementation details, and best practices, see [SECURITY.md](./SECURITY.md).

---

## 📚 Documentation

The project includes comprehensive documentation:

- **[SECURITY.md](./SECURITY.md)** - Overview of the security framework and measures implemented in the application.

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - High-level project overview, statistics, and key achievements.

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guidelines for contributing to the project, including code style and pull request process.

- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide for getting the project up and running.

---

## 🎯 Pages & Routes

The application includes several pages and routes, each serving a specific purpose:

- **`/`** - The homepage features parallax effects and highlights key projects. It serves as the main landing page for visitors.

- **`/about`** - The about page provides information about skills, experience, and background. It helps visitors understand the developer's expertise and capabilities.

- **`/portfolio`** - The interactive project gallery allows visitors to browse through projects with filtering capabilities. Projects can be filtered by category, and each project can be viewed in detail.

- **`/contact`** - The contact form enables visitors to send inquiries and messages. This page is hidden for admin users who have access to the message dashboard instead.

- **`/signup`** - User registration page where new users can create an account. Includes comprehensive form validation and password strength requirements.

- **`/login`** - User authentication page for existing users to log in to their accounts.

- **`/admin/messages`** - Admin-only dashboard for viewing and managing all contact form submissions. This route is protected and only accessible to users with admin privileges.

---

## 🚀 Production Build

To create a production build of the application, run:

```bash
npm run build
```

This command creates an optimized production build in the `dist/` directory. The build includes minified JavaScript and CSS, optimized assets, and is ready for deployment to a production server.

The production build is automatically deployed to Netlify, which serves the static files and handles all backend API calls through Netlify Functions. The backend is fully integrated and hosted on Netlify, ensuring seamless communication between frontend and backend.

## 🌐 Environment Variables for Production

When deploying to production, ensure your `.env` file includes the following variables:

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
ADMIN_EMAILS=admin@example.com
```

Important considerations for production:

- Set `NODE_ENV` to `production` to enable production optimizations and security features
- Update `FRONTEND_URL` to your actual domain name
- Ensure `ADMIN_EMAILS` contains all authorized admin email addresses
- Use HTTPS in production to ensure secure communication
- Consider implementing additional security measures as outlined in the security documentation

---

## 🧪 Testing

The application has been thoroughly tested across multiple platforms and devices to ensure compatibility and functionality:

- **Browsers**: Tested on Chrome, Firefox, Edge, and Safari to ensure cross-browser compatibility
- **Mobile Devices**: Verified functionality on both iOS and Android devices
- **Screen Sizes**: Tested across various screen sizes from 320px (mobile) to 4K resolution (desktop)

All features have been tested to ensure they work correctly across different environments and use cases.

---

## 🤝 Contributing

Contributions to this project are welcome! If you'd like to contribute, please follow these guidelines:

1. Fork the repository and create a feature branch
2. Follow the existing code style and conventions
3. Write clear commit messages
4. Test your changes thoroughly
5. Submit a pull request with a detailed description

For more detailed information about the contribution process, code style guidelines, and best practices, please read [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📝 License

This project is private and proprietary. All rights reserved. This codebase is intended for portfolio and demonstration purposes.

---

## 👤 Author

**Ronin Phoenix Harry Beerwinkel**

This portfolio website was developed to showcase full-stack development capabilities, security implementation, and modern web development practices.

- 🌐 **Portfolio**: [RoninDesignz](https://github.com/RONIN-OP06/RoninDesignzPortfoli0)
- 📧 **Email**: ronindesignz123@gmail.com

---

## 🙏 Acknowledgments

This project was made possible thanks to the excellent tools and resources provided by the open-source community:

- [Shadcn UI](https://ui.shadcn.com/) - For providing a beautiful, accessible component library that made UI development faster and more consistent
- [Three.js](https://threejs.org/) - For excellent documentation and a powerful 3D graphics library that enabled the creation of immersive visualizations
- [React](https://react.dev/) and [Express.js](https://expressjs.com/) - For providing robust, well-documented frameworks that form the foundation of this application

---

<div align="center">

**Note**: This is a portfolio project demonstrating full-stack development capabilities. For production use, consider implementing additional security measures as outlined in the security documentation.

Made with ❤️ by Ronin Phoenix Harry Beerwinkel

</div>
