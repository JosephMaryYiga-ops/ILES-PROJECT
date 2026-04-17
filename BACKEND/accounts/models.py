from django.contrib.auth.models import AbstractUser
from django.db import models



class User(AbstractUser):
    
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('workplace_supervisor', 'Workplace Supervisor'),
        ('academic_supervisor', 'Academic Supervisor'),
        ('admin', 'Administrator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)



class InternshipPlacement(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='placements')
    company_name = models.CharField(max_length=255)
    supervisor_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()    

    
class WeeklyLog(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    )

    student = models.ForeignKey(User, on_delete=models.CASCADE)
    week_number = models.IntegerField()
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    supervisor_comment = models.TextField(blank=True, null=True)


class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=255)
    weight = models.FloatField()


class Evaluation(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.FloatField()


class Notification(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text="The user who receives this notification"
    )
    
    
    message = models.TextField(
        help_text="The notification message content"
    )
    
    
    is_read = models.BooleanField(
        default=False,
        help_text="Has the user viewed this notification?"
    )
    
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When this notification was sent"
    )
    
    
    def __str__(self):
        preview = self.message[:30] + "..." if len(self.message) > 30 else self.message
        return f"To: {self.user.username} | {preview}"
    
    # --- HELPER METHODS ---
    def mark_as_read(self):
        self.is_read = True
        self.save()
    
    def mark_as_unread(self):
        self.is_read = False
        self.save()
    
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"












    
