from django.utils import timezone

from rest_framework import generics, permissions, status
from .models import application, candidate_skills, candidate_resume
from .serializer import applicationCandidateSerializer, applicationHRSerializer
from .serializer import candidateSkillsSerializer, candidateSkillsBulkSerializer
from .serializer import candidateResumeSerializer
from Authentication.permissions import IsRHUser
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView, PermissionDenied
from rest_framework.response import Response
# Create your views here.

## application views

class createApplicationView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = applicationCandidateSerializer
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
class fetchAllApplicationsUserView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = applicationCandidateSerializer
    def get_queryset(self): 
        return application.objects.filter(user=self.request.user, is_deleted=False)

class fetchApplication(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = applicationCandidateSerializer
    queryset = application.objects.filter(is_deleted=False)
    lookup_field = 'uuid'
    
    def get_queryset(self):
        qs = super().get_queryset()
        if not (self.request.user.is_authenticated and self.request.user.isRH):
            qs = qs.filter(user=self.request.user)
        return qs

class fetchAllApplicationsForJobHRView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRHUser]
    serializer_class = applicationHRSerializer
    def get_queryset(self):
        job_uuid = self.kwargs.get('job_uuid')
        return application.objects.filter(job__uuid=job_uuid, is_deleted=False)

class fetchTopFiveApplicationsForJobHRView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRHUser]
    serializer_class = applicationHRSerializer
    def get_queryset(self):
        job_uuid = self.kwargs.get('job_uuid')
        return application.objects.filter(job__uuid=job_uuid, is_deleted=False).order_by('-final_score')[:5]
    
class updateApplicationView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = applicationCandidateSerializer
    queryset = application.objects.filter(is_deleted=False)
    lookup_field = 'uuid'

    def get_queryset(self):
        qs = super().get_queryset()
        if not (self.request.user.is_authenticated and self.request.user.isRH):
            qs = qs.filter(user=self.request.user)
        return qs
    
class deleteApplicationView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = application.objects.filter(is_deleted=False)
    lookup_field = 'uuid'
    def get_queryset(self):
        qs = super().get_queryset()
        if not (self.request.user.is_authenticated and self.request.user.isRH):
            qs = qs.filter(user=self.request.user)
        return qs
    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

## Candidate skills views

class createCandidateSkillBulkView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = candidateSkillsBulkSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        resume = get_object_or_404(candidate_resume, user=self.request.user, is_deleted=False)
        context['resume'] = resume
        context['user'] = self.request.user
        return context

class fetchAllCandidateSkillsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRHUser]
    serializer_class = candidateSkillsSerializer
    
    def get_queryset(self):
        user_uuid = self.kwargs['user_uuid']
        return candidate_skills.objects.filter(user__uuid=user_uuid, is_deleted=False)


## Candidate resume views

class createCandidateResumeView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = candidateResumeSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class fetchAllResumesView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRHUser]
    serializer_class = candidateResumeSerializer
    queryset = candidate_resume.objects.filter(is_deleted=False)

class fetchResumeView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = candidateResumeSerializer
    def get_object(self):
        user_uuid = self.kwargs['user_uuid']
        if not (self.request.user.is_authenticated and self.request.user.isRH):
            if str(self.request.user.uuid) != user_uuid:
                raise PermissionDenied("You do not have permission to view this resume.")
        return get_object_or_404(
            candidate_resume,
            user__uuid=user_uuid,
            is_deleted=False
        )

class deleteResumeView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(
            candidate_resume,
            user=self.request.user,
            is_deleted=False
        )