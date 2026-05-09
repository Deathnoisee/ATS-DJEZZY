from django.utils import timezone

from rest_framework import generics, permissions, serializers

from Ai.tasks import calculate_application_score, extract_skills_from_cv_task
from .models import application, candidate_skills, candidate_resume
from .serializer import applicationCandidateSerializer, applicationHRSerializer
from .serializer import candidateSkillsSerializer, candidateSkillsBulkSerializer
from .serializer import candidateResumeSerializer
from Authentication.permissions import IsRHUser, IsOwnerOrHR
from Authentication.models import Users
from django.shortcuts import get_object_or_404
# Create your views here.

## application views
from django.db import IntegrityError
class createApplicationView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = applicationCandidateSerializer

    def perform_create(self, serializer):
        user = self.request.user
        resume = candidate_resume.objects.filter(user=user, is_deleted=False).first()
        if not resume:
            raise serializers.ValidationError({"resume": "You must upload a resume before applying for a job."})

        job = serializer.validated_data.get("job")
        if application.objects.filter(user=user, job=job, is_deleted=False).exists():
            application.objects.filter(user=user, job=job, is_deleted=False).delete()

        try:
            app_instance = serializer.save(user=user)
        except IntegrityError:
            raise serializers.ValidationError({"job": "You have already applied to this job."})

        calculate_application_score.delay(str(app_instance.uuid))
class fetchAllApplicationsUserView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = applicationCandidateSerializer
    def get_queryset(self): 
        return application.objects.filter(user=self.request.user, is_deleted=False)

class fetchApplication(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = applicationCandidateSerializer
    lookup_field = 'uuid'
    
    def get_queryset(self):
        qs = application.objects.filter(is_deleted=False)
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
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrHR]
    serializer_class = applicationCandidateSerializer
    queryset = application.objects.filter(is_deleted=False)
    lookup_field = 'uuid'

class deleteApplicationView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrHR]
    queryset = application.objects.filter(is_deleted=False)
    lookup_field = 'uuid'
    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

## Candidate skills views

class createCandidateSkillBulkView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRHUser]
    serializer_class = candidateSkillsBulkSerializer
    def get_serializer_context(self):
        context = super().get_serializer_context()
        user_uuid = self.kwargs['user_uuid']
        candidate_user = get_object_or_404(Users, uuid=user_uuid, is_deleted=False)
        resume = get_object_or_404(candidate_resume, user=candidate_user, is_deleted=False)
        context['user'] = candidate_user
        context['resume'] = resume
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
        resume = serializer.save(user=self.request.user)
        extract_skills_from_cv_task.delay(str(resume.uuid))

class fetchAllResumesView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRHUser]
    serializer_class = candidateResumeSerializer
    queryset = candidate_resume.objects.filter(is_deleted=False)

class fetchResumeView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrHR]
    serializer_class = candidateResumeSerializer
    queryset = candidate_resume.objects.filter(is_deleted=False)
    def get_object(self):
        user_uuid = self.kwargs['user_uuid']
        return get_object_or_404(candidate_resume, user__uuid=user_uuid, is_deleted=False)

class deleteResumeView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(
            candidate_resume,
            user=self.request.user,
            is_deleted=False
        )

class deleteAnyResumeView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsRHUser]

    def get_object(self):
        user_uuid = self.kwargs['user_uuid']
        return get_object_or_404(
            candidate_resume,
            user__uuid=user_uuid,
            is_deleted=False
        )