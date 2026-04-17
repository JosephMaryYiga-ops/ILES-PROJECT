from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Issue, Course, Department, AuditLog
from .serializers import (
    IssueSerializer, CourseSerializer,
    DepartmentSerializer, AuditLogSerializer,
)


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    CRUD for departments.
    GET  /api/departments/
    POST /api/departments/
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class CourseViewSet(viewsets.ModelViewSet):
    """
    CRUD for courses.
    GET  /api/courses/
    POST /api/courses/
    """
    queryset = Course.objects.select_related('department').all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


class IssueViewSet(viewsets.ModelViewSet):
    """
    Full CRUD + custom actions for issues.

    Endpoints generated automatically:
      GET    /api/issues/            – list all issues visible to the user
      POST   /api/issues/            – create a new issue
      GET    /api/issues/{id}/       – retrieve single issue
      PUT    /api/issues/{id}/       – full update
      PATCH  /api/issues/{id}/       – partial update (e.g. change status)
      DELETE /api/issues/{id}/       – delete issue

    Custom:
      POST   /api/issues/{id}/resolve/   – mark issue as resolved
      GET    /api/issues/{id}/audit/     – view audit trail
    """
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'course__course_code']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        # Students see only their own issues; staff see all
        if hasattr(user, 'role') and user.role == 'student':
            return Issue.objects.filter(created_by=user).select_related(
                'course', 'created_by', 'assigned_to'
            )
        return Issue.objects.all().select_related(
            'course', 'created_by', 'assigned_to'
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        old_status = self.get_object().status
        instance = serializer.save()
        # Write to audit log if status changed
        if old_status != instance.status:
            AuditLog.objects.create(
                issue=instance,
                actor=self.request.user,
                action=f"Status changed from '{old_status}' to '{instance.status}'",
            )

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """POST /api/issues/{id}/resolve/ — mark an issue as resolved."""
        issue = self.get_object()
        if issue.status == 'resolved':
            return Response({'detail': 'Issue is already resolved.'}, status=400)
        issue.status = 'resolved'
        issue.resolved_at = timezone.now()
        issue.save()
        AuditLog.objects.create(
            issue=issue,
            actor=request.user,
            action="Issue marked as resolved",
        )
        return Response(IssueSerializer(issue, context={'request': request}).data)

    @action(detail=True, methods=['get'])
    def audit(self, request, pk=None):
        """GET /api/issues/{id}/audit/ — view the full audit trail."""
        issue = self.get_object()
        logs = issue.audit_logs.all()
        return Response(AuditLogSerializer(logs, many=True).data)



"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IssueViewSet, CourseViewSet, DepartmentViewSet

router = DefaultRouter()
router.register(r'issues',      IssueViewSet,      basename='issue')
router.register(r'courses',     CourseViewSet,     basename='course')
router.register(r'departments', DepartmentViewSet, basename='department')

urlpatterns = [
    path('api/', include(router.urls)),
]
"""
