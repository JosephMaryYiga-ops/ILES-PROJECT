from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    User, InternshipPlacement, WeeklyLog,
    SupervisorReview, EvaluationCriteria, Evaluation, Notification
)
from .serializers import (
    UserSerializer, RegisterSerializer,
    InternshipPlacementSerializer, WeeklyLogSerializer,
    SupervisorReviewSerializer, EvaluationCriteriaSerializer,
    EvaluationSerializer, NotificationSerializer
)


# ──────────────────────────────────────────
# CUSTOM PERMISSIONS
# ──────────────────────────────────────────
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsWorkplaceSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'workplace_supervisor'

class IsAcademicSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'academic_supervisor'

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'admin'


# ──────────────────────────────────────────
# USER VIEWSET
# ──────────────────────────────────────────
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(pk=user.pk)

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """GET /api/users/me/ — returns the currently logged-in user."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-role/(?P<role>[^/.]+)')
    def by_role(self, request, role=None):
        """GET /api/users/by-role/student/ — admin only."""
        if request.user.role != 'admin':
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.filter(role=role)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


# ──────────────────────────────────────────
# INTERNSHIP PLACEMENT VIEWSET
# ──────────────────────────────────────────
class InternshipPlacementViewSet(viewsets.ModelViewSet):
    serializer_class = InternshipPlacementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return InternshipPlacement.objects.all()
        if user.role == 'student':
            return InternshipPlacement.objects.filter(student=user)
        if user.role == 'workplace_supervisor':
            return InternshipPlacement.objects.filter(supervisor_name=user.get_full_name())
        return InternshipPlacement.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]


# ──────────────────────────────────────────
# WEEKLY LOG VIEWSET
# ──────────────────────────────────────────
class WeeklyLogViewSet(viewsets.ModelViewSet):
    serializer_class = WeeklyLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['week_number', 'created_at', 'status']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return WeeklyLog.objects.filter(student=user)
        if user.role == 'workplace_supervisor':
            return WeeklyLog.objects.filter(status='submitted')
        if user.role in ['academic_supervisor', 'admin']:
            return WeeklyLog.objects.all()
        return WeeklyLog.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    def get_permissions(self):
        if self.action == 'create':
            return [IsStudent()]
        if self.action in ['update', 'partial_update']:
            return [IsStudent()]
        return [permissions.IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        log = self.get_object()
        if log.status != 'draft':
            return Response(
                {'detail': 'You can only edit logs that are still in draft.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """POST /api/logs/{id}/submit/ — student submits their draft log."""
        log = self.get_object()
        if request.user.role != 'student' or log.student != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        if log.status != 'draft':
            return Response({'detail': f"Cannot submit a log with status '{log.status}'."}, status=status.HTTP_400_BAD_REQUEST)
        log.submit()
        return Response(WeeklyLogSerializer(log).data)

    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """POST /api/logs/{id}/review/ — supervisor marks log as reviewed."""
        log = self.get_object()
        if request.user.role != 'workplace_supervisor':
            return Response({'detail': 'Only workplace supervisors can review logs.'}, status=status.HTTP_403_FORBIDDEN)
        if log.status != 'submitted':
            return Response({'detail': f"Cannot review a log with status '{log.status}'."}, status=status.HTTP_400_BAD_REQUEST)
        log.reviewed()
        return Response(WeeklyLogSerializer(log).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """POST /api/logs/{id}/approve/ — academic supervisor or admin approves log."""
        log = self.get_object()
        if request.user.role not in ['academic_supervisor', 'admin']:
            return Response({'detail': 'Not authorized to approve logs.'}, status=status.HTTP_403_FORBIDDEN)
        if log.status != 'reviewed':
            return Response({'detail': f"Cannot approve a log with status '{log.status}'."}, status=status.HTTP_400_BAD_REQUEST)
        log.status = 'approved'
        log.save()
        return Response(WeeklyLogSerializer(log).data)


# ──────────────────────────────────────────
# SUPERVISOR REVIEW VIEWSET
# ──────────────────────────────────────────
class SupervisorReviewViewSet(viewsets.ModelViewSet):
    serializer_class = SupervisorReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'workplace_supervisor':
            return SupervisorReview.objects.filter(reviewer=user)
        if user.role == 'student':
            return SupervisorReview.objects.filter(log__student=user)
        if user.role in ['academic_supervisor', 'admin']:
            return SupervisorReview.objects.all()
        return SupervisorReview.objects.none()

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

    def get_permissions(self):
        if self.action == 'create':
            return [IsWorkplaceSupervisor()]
        return [permissions.IsAuthenticated()]


# ──────────────────────────────────────────
# EVALUATION CRITERIA VIEWSET
# ──────────────────────────────────────────
class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.filter(is_active=True)
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [IsAdminOrReadOnly]


# ──────────────────────────────────────────
# EVALUATION VIEWSET
# ──────────────────────────────────────────
class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Evaluation.objects.filter(student=user)
        if user.role in ['workplace_supervisor', 'academic_supervisor']:
            return Evaluation.objects.filter(evaluator=user)
        if user.role == 'admin':
            return Evaluation.objects.all()
        return Evaluation.objects.none()

    def perform_create(self, serializer):
        serializer.save(evaluator=self.request.user)

    def get_permissions(self):
        if self.action == 'create':
            return [IsWorkplaceSupervisor()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='student/(?P<student_id>[^/.]+)/summary')
    def student_summary(self, request, student_id=None):
        """GET /api/evaluations/student/{id}/summary/ — total weighted score."""
        if request.user.role == 'student' and str(request.user.pk) != student_id:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

        evaluations = Evaluation.objects.filter(
            student_id=student_id
        ).select_related('criteria')

        total_weighted = sum(
            (float(e.score) * float(e.criteria.weight)) / 100
            for e in evaluations
        )

        return Response({
            'student_id': student_id,
            'evaluations': EvaluationSerializer(evaluations, many=True).data,
            'total_weighted_score': round(total_weighted, 2),
        })


# ──────────────────────────────────────────
# NOTIFICATION VIEWSET
# ──────────────────────────────────────────
class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        """POST /api/notifications/{id}/mark-read/"""
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        """POST /api/notifications/mark-all-read/"""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all notifications marked as read'})