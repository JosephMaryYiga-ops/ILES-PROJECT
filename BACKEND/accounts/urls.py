from django.urls import path
from .views_user_management import get_all_users, create_user, delete_user

urlpatterns = [
    path('admin/users/', get_all_users, name='get_all_users'),
    path('admin/users/create/', create_user, name='create_user'),
    path('admin/users/<int:user_id>/delete/', delete_user, name='delete_user'),
]