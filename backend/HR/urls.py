from django.urls import path, include

from .Views.globalViews import CreateJobView, FetchAllJobsView, FetchJobDetailView, JobSkillsListView, SoftDeleteJobView, UpdateJobView
from .Views.globalViews import JobSkillBulkCreateView, JobSkillsListView, JobSkillUpdateView, JobSkillDeleteView
from .Views.globalViews import JobRequirementBulkCreateView, JobRequirementsListView, JobRequirementUpdateView, JobRequirementDeleteView
from .Views.statsViews import StatsView, JobStatsView

urlpatterns = [

    # JOB DATA CRUD operations

    path('jobs/create/', CreateJobView.as_view(), name='create-job'),
    path('jobs/', FetchAllJobsView.as_view(), name='fetch-all-jobs'),
    path('jobs/<uuid:uuid>/', FetchJobDetailView.as_view(), name='fetch-job-detail'),
    path('jobs/<uuid:uuid>/delete/', SoftDeleteJobView.as_view(), name='soft-delete-job'),
    path('jobs/<uuid:uuid>/update/', UpdateJobView.as_view(), name='update-job'),

    # JOB SKILLS CRUD operations

    path('skills/bulk/<uuid:job_uuid>/create/', JobSkillBulkCreateView.as_view(), name='bulk-create-job-skills'),
    path('skills/<uuid:job_uuid>/', JobSkillsListView.as_view(), name='list-job-skills'),
    path('skills/bulk/update/', JobSkillUpdateView.as_view(), name='update-job-skill'),
    path('skills/<uuid:uuid>/delete/', JobSkillDeleteView.as_view(), name='delete-job-skill'),

    # JOB REQUIREMENTS CRUD operations

    path('requirements/bulk/<uuid:job_uuid>/create/', JobRequirementBulkCreateView.as_view(), name='bulk-create-job-requirements'),
    path('requirements/<uuid:job_uuid>/', JobRequirementsListView.as_view(), name='list-job-requirements'),
    path('requirements/<uuid:uuid>/update/', JobRequirementUpdateView.as_view(), name='update-job-requirement'),
    path('requirements/<uuid:uuid>/delete/', JobRequirementDeleteView.as_view(), name='delete-job-requirement'),

    # STATS

    path('stats/dashboard', StatsView.as_view(), name='stats'),
    path('stats/jobs/<uuid:job_uuid>/', JobStatsView.as_view(), name='job-stats'),
]
