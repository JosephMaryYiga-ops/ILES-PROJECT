ILES Project Reflection

Technical Lessons Learned

1. Full-stack integration: I learned how a Django REST API communicates with a React frontend using JWT authentication. The token-based system requires storing access tokens in localStorage and sending them in Authorization headers.

2. Role-based access control: Implementing 4 user roles (student, workplace supervisor, academic supervisor, admin) taught me how to manage permissions. Each role sees different navigation links and has different API permissions.

3. Deployment challenges: Deploying to Render revealed that Windows and Linux handle file names differently. On Windows, EvaluationCriteria.jsx and evaluationcriteria.jsx are the same, but on Linux they are different files. This caused build failures that I fixed by ensuring consistent capitalization.

Challenges Faced

1. Login issues: Users could not login even with correct credentials. The root cause was an empty role field in the database. I fixed this by adding fallback logic in the ProtectedRoute component that treats empty role as admin.

2. File import errors during deployment: Render builds failed because import statements used different capitalization than actual file names. I had to check GitHub repository file names and update imports to match exactly.

3. CORS configuration: The frontend could not communicate with the backend until I properly configured django-cors-headers in settings.py.

Problem-Solving Approaches

1. Systematic debugging: I used Django shell to test authentication directly, then browser console to test API endpoints, then isolated frontend-specific issues. This helped identify whether problems were in backend, API, or frontend.

2. Incremental deployment: I deployed the backend first and verified the API worked using the DRF browsable API before deploying the frontend. This made it easier to identify which layer caused issues.

3. Error log analysis: I carefully read Render build logs to identify missing files, incorrect imports, and missing environment variables.

Areas for Improvement

1. Email notifications: Currently using console backend for testing. Need to configure SMTP for actual email sending.

2. Testing: Add more frontend unit tests using Jest and React Testing Library.

3. Performance: Implement pagination for logs list when many entries exist.

4. Security: Implement rate limiting and stronger password validation for production.

What I Would Do Differently

1. Start deployment earlier: Testing deployment early would have revealed file case-sensitivity issues sooner.

2. Consistent naming: Use the same file naming convention from the beginning to avoid import errors.

3. Write tests first: Writing tests before implementing features would have caught bugs earlier.