from rest_framework import generics, permissions
from .models import Users
from .serializer import UserRegisterSerializer, UserProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = Users.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer