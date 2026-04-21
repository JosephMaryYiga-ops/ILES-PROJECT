from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils import timezone

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
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE,limit_choices_to={'role':'student'})
    week_number = models.IntegerField(help_text='The week number')
    placement = models.ForeignKey(
    InternshipPlacement, 
    on_delete=models.CASCADE,
    related_name='weekly_logs'
)
    content = models.TextField(help_text='Detailed description')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    supervisor_comment = models.TextField(blank=True, null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta:
        ordering=['-week_number','-created_at']
    def clean(self):
        if self.week_number<1:
            raise ValidationError({'week_number':'Must be atleast 1'})
            
    def submit(self):
        self.status='submitted'
        self.save()
        
    def reviewed(self):
       self.status='reviewed'
       self.save()
       
       
    def __str__(self):
        return f"Week {self.week_number} - {self.student.username} ({self.status})"


class SupervisorReview(models.Model):
  
    log = models.OneToOneField(
        'WeeklyLog',
        on_delete=models.CASCADE,
        related_name='review',
        help_text="The weekly log being reviewed"
    )
    
    reviewer = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviews_given',
        limit_choices_to={'role': 'workplace_supervisor'},
        help_text="The supervisor who performed this review"
    )
    
    
    comments = models.TextField(
        help_text="Feedback and observations on the student's work"
    )
    
    score = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        help_text="Score for this log (e.g., 8.5 out of 10)"
    )
    
    reviewed_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When this review was submitted"
    )
    
    class Meta:
        verbose_name = "Supervisor Review"
        verbose_name_plural = "Supervisor Reviews"
        ordering = ['-reviewed_at']
    
    def clean(self):
    
        if self.log.status != 'submitted':
            raise ValidationError({
                'log': f"Cannot review a log with status '{self.log.status}'. Must be 'submitted'."
            })
        
       
        if self.score < 0 or self.score > 10:
            raise ValidationError({
                'score': 'Score must be between 0 and 10'})
    
    
    def __str__(self):
        return f"Review of {self.log} by {self.reviewer.username if self.reviewer else 'Unknown'}"

class EvaluationCriteria(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    evaluator = models.CharField(
        max_length=20,
        choices=[
            ('workplace', 'Workplace Supervisor'),
            ('academic', 'Academic Supervisor'),
        ],
        default='academic'
    )
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.weight}%)"


class Evaluation(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['student', 'criteria']]




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












    
