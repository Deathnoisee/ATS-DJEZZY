from django.shortcuts import get_object_or_404, render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from Authentication.permissions import IsRHUser
from .models import job_Data, job_skills, job_requirements
from .serializer import JobDetailPublicSerializer, jobDataSerializer, jobRawRequirementsSerializer, BulkJobSkillsSerializer, jobSkillsSerializer, jobRequirementsSerializer, BulkJobRequirementsSerializer
from django.utils import timezone
from rest_framework import serializers
from Ai.tasks import extract_skills_from_job_description_task

# JOB CRUD operations


class CreateJobView(generics.CreateAPIView):
    permission_classes = [IsRHUser]
    queryset = job_Data.objects.all()
    serializer_class = jobDataSerializer
    def perform_create(self, serializer):
        job = serializer.save()
        raw_text = job.raw_requirements
        extract_skills_from_job_description_task.delay(str(job.uuid))

class FetchAllJobsView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    qs = job_Data.objects.filter(is_deleted=False, isOpen=True)
    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.isRH:
            return jobDataSerializer
        return JobDetailPublicSerializer
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.isRH:
            return job_Data.objects.filter(is_deleted=False)
        return self.qs

class FetchJobDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    qs = job_Data.objects.filter(is_deleted=False, isOpen=True)
    lookup_field = 'uuid'
    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.isRH:
            return jobDataSerializer
        return JobDetailPublicSerializer
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.isRH:
            return job_Data.objects.filter(is_deleted=False)
        return self.qs

class SoftDeleteJobView(generics.DestroyAPIView):
    permission_classes = [IsRHUser]
    queryset = job_Data.objects.filter(is_deleted=False, isOpen=True)
    lookup_field = 'uuid'
    def perform_destroy(self, instance):
        job_Data.objects.filter(pk = instance.pk).update(
            isOpen=False,
            is_deleted=True, 
            deleted_at=timezone.now()
            )

class UpdateJobView(generics.UpdateAPIView):
    permission_classes = [IsRHUser]
    queryset = job_Data.objects.filter(is_deleted=False)
    serializer_class = jobDataSerializer
    lookup_field = 'uuid'


# JOB SKILLS CRUD operations

class JobSkillBulkCreateView(generics.CreateAPIView):
    serializer_class = BulkJobSkillsSerializer
    permission_classes = [IsRHUser]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        job_uuid = self.kwargs['job_uuid']
        context['job'] = get_object_or_404(job_Data, uuid=job_uuid, is_deleted=False)
        return context

class JobSkillsListView(generics.ListAPIView):
    permission_classes = [IsRHUser]
    serializer_class = jobSkillsSerializer
    def get_queryset(self):
        job_uuid = self.kwargs['job_uuid']
        job = get_object_or_404(job_Data, uuid=job_uuid, is_deleted=False)
        return job_skills.objects.filter(job=job)

class JobSkillUpdateView(generics.UpdateAPIView):
    permission_classes = [IsRHUser]
    serializer_class = jobSkillsSerializer
    queryset = job_skills.objects.filter(is_deleted=False)
    lookup_field = 'uuid'

class JobSkillDeleteView(generics.DestroyAPIView):
    permission_classes = [IsRHUser]
    queryset = job_skills.objects.filter(is_deleted=False)
    lookup_field = 'uuid'


# JOB REQUIREMENTS CRUD operations


class JobRequirementBulkCreateView(generics.CreateAPIView):
    serializer_class = BulkJobRequirementsSerializer
    permission_classes = [IsRHUser]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        job_uuid = self.kwargs['job_uuid']
        context['job'] = get_object_or_404(job_Data, uuid=job_uuid, is_deleted=False)
        return context

class JobRequirementsListView(generics.ListAPIView):
    permission_classes = [IsRHUser]
    serializer_class = jobRequirementsSerializer
    def get_queryset(self):
        job_uuid = self.kwargs['job_uuid']
        job = get_object_or_404(job_Data, uuid=job_uuid, is_deleted=False)
        return job_requirements.objects.filter(job=job)

class JobRequirementUpdateView(generics.UpdateAPIView):
    permission_classes = [IsRHUser]
    serializer_class = jobRequirementsSerializer
    queryset = job_requirements.objects.filter(is_deleted=False)
    lookup_field = 'uuid'

class JobRequirementDeleteView(generics.DestroyAPIView):
    permission_classes = [IsRHUser]
    queryset = job_requirements.objects.filter(is_deleted=False)
    lookup_field = 'uuid'