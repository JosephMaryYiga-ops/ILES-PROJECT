# ILES-PROJECT
The Internship & Logging Evaluation System (ILES) - a software development project.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, defaults to SQLite for local dev)

### Backend Setup (Django)
1. Navigate to the BACKEND directory:
   ```
   cd BACKEND
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Apply migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser (optional):
   ```
   python manage.py createsuperuser
   ```

6. Run the server:
   ```
   python manage.py runserver
   ```
   The backend will run on http://127.0.0.1:8000

### Frontend Setup (React)
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```
   The frontend will run on http://localhost:5173 (or next available port)

### Usage
- Open the frontend URL in your browser.
- Log in with existing users:
  - Admin: username `admin1`, password `greatminds`
  - Student: username `student1`, password (set during creation)
  - Supervisor: username `supervisor1`, password (set during creation)

### Notes
- Each developer will have their own local database (SQLite).
- For shared data, configure a PostgreSQL database and update `settings.py`.
- Ensure CORS settings allow your frontend port (e.g., 5173 or 5174).
