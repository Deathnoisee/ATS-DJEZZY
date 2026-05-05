from django.db.models import Avg, Count
from ...models import job_Data
from Authentication.models import Users
from candidates.models import application




def get_total_jobs():
    return job_Data.objects.filter(is_deleted=False).count()

def get_total_open_jobs():
    return job_Data.objects.filter(is_deleted=False, is_closed=False).count()

def get_total_closed_jobs():
    return job_Data.objects.filter(is_deleted=False, is_closed=True).count()

def get_total_jobs_by_department(department):
    return job_Data.objects.filter(is_deleted=False, department=department).count()

def get_total_jobs_by_location(location):
    return job_Data.objects.filter(is_deleted=False, location=location).count()

def get_total_users():
    return Users.objects.filter(is_deleted=False, is_active=True).count()

def get_total_applications():
    return application.objects.filter(is_deleted=False).count()

def get_most_applied_jobs():
    most_applied = job_Data.objects.filter(is_deleted=False).annotate(application_count=Count('application')) .order_by('-application_count')[:5]
    return most_applied

def get_job_applications_count(job_uuid):
    return application.objects.filter(job__uuid=job_uuid, is_deleted=False).count()

def get_application_status_distribution():
    return application.objects.filter(is_deleted=False).values('status').annotate(count=Count('status'))

def get_average_scores(job_uuid):
    return application.objects.filter(job__uuid=job_uuid, is_deleted=False).aggregate(average_score=Avg('final_score'))['average_score']

def job_best_5(job_uuid):
    return application.objects.filter(job__uuid=job_uuid, is_deleted=False).order_by('-final_score')[:5]