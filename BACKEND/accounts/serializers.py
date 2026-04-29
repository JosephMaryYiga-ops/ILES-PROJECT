from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, InternshipPlacement, WeeklyLog,
    SupervisorReview, EvaluationCriteria, Evaluation, Notification
)


# ──────────────────────────────────────────
# USER
# ──────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data['role'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


# ──────────────────────────────────────────
# INTERNSHIP PLACEMENT
# ──────────────────────────────────────────
class InternshipPlacementSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = InternshipPlacement
        fields = [
            'id', 'student', 'student_name',
            'company_name', 'supervisor_name',
            'start_date', 'end_date',
        ]


# ──────────────────────────────────────────
# WEEKLY LOG
# ──────────────────────────────────────────
class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = WeeklyLog
        fields = [
            'id', 'student', 'student_name', 'placement',
            'week_number', 'content', 'status', 'status_display',
            'supervisor_comment', 'created_at', 'updated_at',
        ]
        read_only_fields = ['student','status', 'created_at', 'updated_at']

    def validate_week_number(self, value):
        if value < 1:
            raise serializers.ValidationError('Week number must be at least 1.')
        return value


# ──────────────────────────────────────────
# SUPERVISOR REVIEW
# ──────────────────────────────────────────
class SupervisorReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)

    class Meta:
        model = SupervisorReview
        fields = [
            'id', 'log', 'reviewer', 'reviewer_name',
            'comments', 'score', 'reviewed_at',
        ]
        read_only_fields = ['reviewed_at']

    def validate_score(self, value):
        if not (0 <= value <= 10):
            raise serializers.ValidationError('Score must be between 0 and 10.')
        return value

    def validate(self, data):
        log = data.get('log')
        if log and log.status != 'submitted':
            raise serializers.ValidationError(
                f"Cannot review a log with status '{log.status}'. It must be 'submitted'."
            )
        return data


# ──────────────────────────────────────────
# EVALUATION CRITERIA
# ──────────────────────────────────────────
class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = ['id', 'name', 'description', 'weight', 'evaluator', 'is_active']

    def validate_weight(self, value):
        if not (1 <= value <= 100):
            raise serializers.ValidationError('Weight must be between 1 and 100.')
        return value


# ──────────────────────────────────────────
# EVALUATION
# ──────────────────────────────────────────
class EvaluationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    criteria_name = serializers.CharField(source='criteria.name', read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'id', 'student', 'student_name',
            'criteria', 'criteria_name',
            'score', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_score(self, value):
        if not (0 <= value <= 100):
            raise serializers.ValidationError('Score must be between 0 and 100.')
        return value


# ──────────────────────────────────────────
# NOTIFICATION
# ──────────────────────────────────────────
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at']
        read_only_fields = ['created_at']