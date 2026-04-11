from django.contrib.auth.models import AbstractUser
from django.db import models

<<<<<<< HEAD

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













    
=======
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('supervisor', 'Supervisor'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    # Extra fields
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    
    # Student-specific
    registration_number = models.CharField(max_length=50, blank=True, null=True)
    course = models.CharField(max_length=100, blank=True, null=True)
    
    # Supervisor-specific
    company_name = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
>>>>>>> 0f21ed2431eecbddcf3560b48d264cea39e1e668
