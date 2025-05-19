Please read general_context.md to understand the repository structure before starting this task.

Create a comprehensive user creation module for both frontend and backend with the following features:
1. Password strength validation with multiple levels
2. Email uniqueness validation
3. User-friendly form with proper feedback

Tasks:

1. Enhance the frontend React component (src/components/CreateUser.js):
   - Add password strength meter with visual indicators
   - Implement client-side validation for all fields
   - Add real-time feedback for validation errors
   - Create responsive form layout with proper error states

2. Extend the backend API endpoint (api/index.php):
   - Implement server-side email uniqueness validation
   - Add robust password strength validation logic
   - Create proper error handling with meaningful messages
   - Sanitize and validate all input data

3. Connect frontend and backend:
   - Handle API responses appropriately
   - Display server validation errors to users
   - Implement success/failure notifications

Use only existing dependencies from package.json for the React frontend (React, Axios) and native PHP functionality for the backend. Reference the existing API endpoints (/users GET and POST) and CreateUser.js component for implementation patterns.