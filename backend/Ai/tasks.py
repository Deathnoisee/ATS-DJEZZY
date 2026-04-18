from celery import shared_task
from .services import extract_skills_from_cv, microCalculator, macroCalculator, calculate_score

@shared_task
def calculate_application_score(application_uuid):
    return calculate_score(application_uuid)

@shared_task
def calculate_micro_score(application_uuid):
    return microCalculator(application_uuid)

@shared_task
def calculate_macro_score(application_uuid):
    return macroCalculator(application_uuid)

@shared_task
def extract_skills_from_cv_task(raw_Text):
    return extract_skills_from_cv(raw_Text)