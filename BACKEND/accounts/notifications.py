from django.core.mail import send_mail
from django.conf import settings

def send_log_submitted_notification(log):
    """Send email when student submits a log"""
    try:
        subject = f'[ILES] Weekly Log Submitted - Week {log.week_number}'
        message = f"""
Student: {log.student.username}
Week: {log.week_number}
Content: {log.content[:300]}

Login to review: http://localhost:5173/supervisor/review
        """
        send_mail(subject, message, settings.EMAIL_HOST_USER, ['supervisor@example.com'], fail_silently=False)
    except Exception as e:
        print(f"Email error: {e}")

def send_review_completed_notification(review):
    """Send email when supervisor reviews a log"""
    try:
        subject = f'[ILES] Your Weekly Log Has Been Reviewed'
        message = f"""
Your Week {review.log.week_number} log has been reviewed by {review.reviewer.username}.

Score: {review.score}/10
Comments: {review.comments}

Login to view: http://localhost:5173/student/logs
        """
        send_mail(subject, message, settings.EMAIL_HOST_USER, [review.log.student.email], fail_silently=False)
    except Exception as e:
        print(f"Email error: {e}")