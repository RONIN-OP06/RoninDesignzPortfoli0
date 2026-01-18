# Contributing to RoninDesignz

Thank you for your interest in contributing to RoninDesignz! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your branch: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

1. Install dependencies: `npm install`
2. Create a `.env` file based on `.env.example`
3. Start the development server: `npm run dev`
4. Start the backend server: `npm start`

## Code Style

- Follow the existing code style and patterns
- Use ES modules
- Use functional components with hooks
- Follow atomic design principles for components
- Use meaningful variable and function names
- Add comments for complex logic

## Component Structure

- **atoms/** - Basic, reusable UI elements
- **molecules/** - Simple component combinations
- **organisms/** - Complex, feature-specific components
- **templates/** - Page-level components

## Testing

- Test your changes in both development and production builds
- Test on different screen sizes (responsive design)
- Test authentication flows if modifying auth-related code
- Verify API endpoints work correctly

## Commit Messages

Use clear, descriptive commit messages:
- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update README`
- `style: Format code`
- `refactor: Refactor component`
- `test: Add tests`

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Update documentation if needed
3. Test your changes thoroughly
4. Describe your changes in the PR description
5. Reference any related issues

## Security

- Never commit sensitive data (passwords, API keys, etc.)
- Never commit `members.json` or `messages.json`
- Never commit `.env` files
- Review security implications of your changes

## Questions?

If you have questions, please open an issue for discussion.
