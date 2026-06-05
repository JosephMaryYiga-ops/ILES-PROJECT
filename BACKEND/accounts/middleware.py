from .models import AuditLog

class AuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Log POST, PUT, PATCH, DELETE requests from authenticated users
        if request.user.is_authenticated and request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            AuditLog.objects.create(
                actor=request.user,
                action=f"{request.method} {request.path}"
            )
        
        return response