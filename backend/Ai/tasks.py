from celery import shared_task
from .services import extract_skills_from_cv, extract_skills_from_job_description, microCalculator, macroCalculator, calculate_score
from HR.models import job_Data
from candidates.models import application, candidate_resume
from django.shortcuts import get_object_or_404
@shared_task
def calculate_application_score(application_uuid):
    calculate_macro_score(application_uuid)
    calculate_micro_score(application_uuid)    
    return calculate_score(application_uuid)

@shared_task
def calculate_micro_score(application_uuid):
    return microCalculator(application_uuid)

@shared_task
def calculate_macro_score(application_uuid):
    return macroCalculator(application_uuid)

@shared_task
def extract_skills_from_cv_task(resume_uuid):
    return extract_skills_from_cv(resume_uuid)

@shared_task
def extract_skills_from_job_description_task(job_uuid):

    job = get_object_or_404(job_Data, uuid=job_uuid, is_deleted=False)
    raw_text = job.jobs_requirement_raw
    raw_text = raw_text.encode('utf-8')


    return extract_skills_from_job_description(raw_text)