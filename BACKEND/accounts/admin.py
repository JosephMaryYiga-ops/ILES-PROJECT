from django.contrib import admin
from .models import User, InternshipPlacement, WeeklyLog, EvaluationCriteria, Evaluation, Notification, AuditLog


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')
    list_filter = ('role',)

@admin.register(InternshipPlacement)
class InternshipPlacementAdmin(admin.ModelAdmin):
    list_display = ('student', 'company_name', 'supervisor_name')
    list_filter = ('student',)

@admin.register(WeeklyLog)
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('student', 'week_number', 'status')
    list_filter = ('status',)

@admin.register(EvaluationCriteria)
class EvaluationCriteriaAdmin(admin.ModelAdmin):
    list_display = ('name', 'weight')

@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('student', 'criteria', 'score')
    list_filter = ('criteria',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id','user','is_read','created_at']
    list_filter  = ['is_read']
    search_fields = ['message','user__username']

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['id','actor','action','created_at']
    