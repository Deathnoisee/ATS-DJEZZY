# urls.py (in your main project folder)
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView

urlpatterns = [
    # AUTH ENDPOINTS (Provided by JWT)
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # CUSTOM ENDPOINTS (You wrote these)
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/auth/profile/', ProfileView.as_view(), name='auth_profile'),
]