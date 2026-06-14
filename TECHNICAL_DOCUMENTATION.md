ILES - Technical Documentation

1. System Architecture

The system consists of three main layers:
- React Frontend (User Interface)
- Django Backend (REST API)
- PostgreSQL Database

Frontend (React) communicates with Backend (Django) via REST API calls.
JWT tokens handle authentication between frontend and backend.

2. Technology Stack

Layer              Technology           Version
Frontend           React                18.2.0
Frontend Build     Vite                 5.0.0
Backend            Django               6.0.3
API                Django REST Framework 3.17.0
Authentication     JWT (SimpleJWT)      5.5.0
Database           PostgreSQL           15
Deployment         Render               -

3. API Endpoints

POST   /api/auth/register/    - User registration (no auth)
POST   /api/auth/login/       - User login (no auth)
POST   /api/auth/refresh/     - Refresh JWT token (no auth)
GET    /api/users/            - List users (JWT required)
POST   /api/users/            - Create user (admin only)
GET    /api/logs/             - List logs (JWT required)
POST   /api/logs/             - Create log (JWT required)
POST   /api/logs/{id}/submit/ - Submit log (JWT required)
GET    /api/placements/       - List placements (JWT required)
POST   /api/placements/       - Create placement (admin only)
GET    /api/criteria/         - List evaluation criteria (JWT required)
POST   /api/criteria/         - Create criteria (admin only)
GET    /api/evaluations/      - List evaluations (JWT required)

4. Database Schema

User Table
- id: Integer (Primary key)
- username: String (Unique)
- email: String
- role: String (student/admin/workplace_supervisor/academic_supervisor)
- is_active: Boolean
- password: String (hashed)

WeeklyLog Table
- id: Integer (Primary key)
- student_id: ForeignKey (references User)
- week_number: Integer (1-52)
- content: Text
- status: String (draft/submitted/reviewed/approved)
- supervisor_comment: Text
- created_at: DateTime
- updated_at: DateTime

EvaluationCriteria Table
- id: Integer (Primary key)
- name: String
- description: Text
- weight: Decimal
- evaluator: String (workplace/academic)
- is_active: Boolean

Evaluation Table
- id: Integer (Primary key)
- student_id: ForeignKey (references User)
- criteria_id: ForeignKey (references EvaluationCriteria)
- score: Decimal

5. Environment Variables

Variable Name        Purpose                          Example Value
DEBUG                Development mode control         False
SECRET_KEY           Django security key              (generated)
ALLOWED_HOSTS        Allowed domains                  *.onrender.com
VITE_API_URL         Backend API URL                  https://iles-backend.onrender.com/api/

6. Local Development Setup

Backend Setup:
cd BACKEND
python -m venv venv
source venv/bin/activate (Windows: venv\Scripts\activate)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend Setup:
cd frontend
npm install
npm run dev

7. Deployment Configuration

Backend (Render):
- Build Command: pip install -r requirements.txt
- Start Command: gunicorn config.wsgi:application
- Environment: Python 3

Frontend (Render):
- Build Command: npm install && npm run build
- Publish Directory: dist
- Environment: Node

8. Testing

Run Backend Tests:
cd BACKEND
python manage.py test accounts

Test Coverage:
- User model tests: 4 tests
- Login API tests: 4 tests
- Weekly log tests: 3 tests
- Review workflow tests: 3 tests
- Evaluation tests: 2 tests
Total: 16 tests

9. Live URLs

Frontend: https://iles-frontend.onrender.com
Backend API: https://iles-backend.onrender.com/api/