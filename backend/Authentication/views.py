from rest_framework import generics, permissions
from .models import Users
from .serializer import HRUserUpdateSerializer, candidateSerializer, hrSerializer
from .permissions import IsRHUser
from django.utils import timezone

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = candidateSerializer
    permission_classes = [permissions.AllowAny]


class RegisterAsHRView(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = hrSerializer
    permission_classes = [IsRHUser]

class CandidateDeleteSelfView(generics.DestroyAPIView):
    def get_object(self):
        return self.request.user
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.deleted_at = timezone.now()
        instance.save()

class HRUserDeleteView(generics.DestroyAPIView):
    queryset = Users.objects.filter(isRH=False, is_active=True, is_deleted=False)
    permission_classes = [IsRHUser]
    lookup_field = 'uuid'
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

class HRUpdateView(generics.UpdateAPIView):
    queryset = Users.objects.filter(isRH=False, is_active=True, is_deleted=False)
    serializer_class = HRUserUpdateSerializer
    permission_classes = [IsRHUser]
    lookup_field = 'uuid'

class HRFetchAllView(generics.ListAPIView):
    queryset = Users.objects.filter(isRH=False, is_active=True, is_deleted=False)
    serializer_class = hrSerializer
    permission_classes = [IsRHUser]