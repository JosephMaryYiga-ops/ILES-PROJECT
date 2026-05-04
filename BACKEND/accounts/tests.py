from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, InternshipPlacement, WeeklyLog, SupervisorReview, EvaluationCriteria, Evaluation


class ILESBackendTests(TestCase):

    def setUp(self):
        """Create test users and shared data used across tests."""
        self.client = APIClient()

        # Create users
        self.student = User.objects.create_user(
            username='teststudent',
            password='Pass1234!',
            role='student',
            email='student@iles.com'
        )
        self.workplace_supervisor = User.objects.create_user(
            username='testsupervisor',
            password='Pass1234!',
            role='workplace_supervisor',
            email='supervisor@iles.com'
        )
        self.academic_supervisor = User.objects.create_user(
            username='testacademic',
            password='Pass1234!',
            role='academic_supervisor',
            email='academic@iles.com'
        )
        self.admin = User.objects.create_user(
            username='testadmin',
            password='Pass1234!',
            role='admin',
            email='admin@iles.com'
        )

        # Create a placement
        self.placement = InternshipPlacement.objects.create(
            student=self.student,
            company_name='Test Company',
            supervisor_name='Mr. Supervisor',
            start_date='2025-01-01',
            end_date='2025-06-30',
        )

    # ──────────────────────────────────────────
    # TEST 1 — Register a new user
    # ──────────────────────────────────────────
    def test_register_user(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'newstudent',
            'password': 'Pass1234!',
            'email': 'new@iles.com',
            'role': 'student',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'newstudent')
        self.assertEqual(response.data['user']['role'], 'student')

    # ──────────────────────────────────────────
    # TEST 2 — Login and get token
    # ──────────────────────────────────────────
    def test_login_returns_token(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'teststudent',
            'password': 'Pass1234!',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['role'], 'student')

    # ──────────────────────────────────────────
    # TEST 3 — Student creates a log (draft)
    # ──────────────────────────────────────────
    def test_student_creates_log(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.post('/api/logs/', {
            'placement': self.placement.id,
            'week_number': 1,
            'content': 'I worked on Django this week.',
        })
        print(response.data)  # add this so we can see the error
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'draft')
    
    # TEST 4 — Student submits a log
    
    def test_student_submits_log(self):
        self.client.force_authenticate(user=self.student)
        log = WeeklyLog.objects.create(
            student=self.student,
            placement=self.placement,
            week_number=2,
            content='Second week content.',
            status='draft'
        )
        response = self.client.post(f'/api/logs/{log.id}/submit/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'submitted')

    # ──────────────────────────────────────────
    # TEST 5 — Cannot submit an already submitted log
    # ──────────────────────────────────────────
    def test_cannot_submit_already_submitted_log(self):
        self.client.force_authenticate(user=self.student)
        log = WeeklyLog.objects.create(
            student=self.student,
            placement=self.placement,
            week_number=3,
            content='Third week.',
            status='submitted'
        )
        response = self.client.post(f'/api/logs/{log.id}/submit/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ──────────────────────────────────────────
    # TEST 6 — Supervisor reviews a submitted log
    # ──────────────────────────────────────────
    def test_supervisor_reviews_log(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        log = WeeklyLog.objects.create(
            student=self.student,
            placement=self.placement,
            week_number=4,
            content='Week 4 content.',
            status='submitted'
        )
        response = self.client.post('/api/reviews/', {
            'log': log.id,
            'comments': 'Good work this week.',
            'score': '8.5',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(response.data['score']), 8.5)

    # ──────────────────────────────────────────
    # TEST 7 — Cannot review a draft log
    # ──────────────────────────────────────────
    def test_cannot_review_draft_log(self):
        self.client.force_authenticate(user=self.workplace_supervisor)
        log = WeeklyLog.objects.create(
            student=self.student,
            placement=self.placement,
            week_number=5,
            content='Week 5 draft.',
            status='draft'
        )
        response = self.client.post('/api/reviews/', {
            'log': log.id,
            'comments': 'Trying to review a draft.',
            'score': '7.0',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ──────────────────────────────────────────
    # TEST 8 — Student cannot access supervisor endpoints
    # ──────────────────────────────────────────
    def test_student_cannot_create_review(self):
        self.client.force_authenticate(user=self.student)
        log = WeeklyLog.objects.create(
            student=self.student,
            placement=self.placement,
            week_number=6,
            content='Week 6.',
            status='submitted'
        )
        response = self.client.post('/api/reviews/', {
            'log': log.id,
            'comments': 'Student trying to review.',
            'score': '9.0',
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ──────────────────────────────────────────
    # TEST 9 — Evaluation score computes correctly
    # ──────────────────────────────────────────
    def test_evaluation_score_computed(self):
        criteria = EvaluationCriteria.objects.create(
            name='Punctuality',
            weight=40,
            evaluator='workplace'
        )
        # Score 80 with weight 40 = total_score of 32.0
        evaluation = Evaluation.objects.create(
            student=self.student,
            criteria=criteria,
            score=80,
        )
        self.client.force_authenticate(user=self.academic_supervisor)
        response = self.client.get(f'/api/evaluations/student/{self.student.id}/summary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_weighted_score'], 32.0)

    # ──────────────────────────────────────────
    # TEST 10 — Admin can list all users
    # ──────────────────────────────────────────
    def test_admin_can_list_all_users(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see all 4 users created in setUp
        self.assertGreaterEqual(len(response.data), 4)