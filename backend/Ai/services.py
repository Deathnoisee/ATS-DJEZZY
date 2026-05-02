from .models import ExtractionLog
from .logic.tree_matching.ScoringLogic.scoring import calculate_final_score_with_experience, calculate_final_score_with_priority
from .logic.tree_matching.tree import build_sample_tree
from HR.models import job_Data, job_skills 
from candidates.models import application, candidate_resume, candidate_skills
from django.shortcuts import get_object_or_404
from .LLM_extraction.extractor import extract_from_resume
from .LLM_extraction.pdf_reader import extract_text_from_pdf
from django.utils import timezone
root = build_sample_tree()

## LLM extraction function
def extract_skills_from_cv(resume_uuid):
    #Get resume and user from DB
    resume = get_object_or_404(candidate_resume, uuid=resume_uuid, is_deleted=False)
    user = resume.user

    #Extract text from PDF
    cv_text = extract_text_from_pdf(resume.resume_file.path)

    #Call LLM and get result
    extraction = extract_from_resume(cv_text)

    #Fill candidate_skills table
    candidate_skills.objects.filter(user=user, is_deleted=False).update(
        is_deleted=True,
        deleted_at=timezone.now()
    )
    for ws in extraction.weighted_skills:
        candidate_skills.objects.create(
            user=user,
            resume=resume,
            skill_name=ws.skill,
            experience=int(round(extraction.experience_years or 0.0)),
        )
    return extraction

def extract_skills_from_job_description(job_uuid):
    from .LLM_extraction.extractor import extract_from_jd
    from HR.models import job_Data
    from django.shortcuts import get_object_or_404

    #Get job from DB
    job = get_object_or_404(job_Data, uuid=job_uuid, is_deleted=False)

    #Call LLM and get result
    extraction = extract_from_jd(jd_text=job.job_description)

    #Fill job_skills table
    job_skills.objects.filter(job=job, is_deleted=False).update(
        is_deleted=True,
        deleted_at=timezone.now()
    )
    for ws in extraction.weighted_skills:
        job_skills.objects.create(
            job=job,
            skill=ws.skill,
            experience=int(round(extraction.experience_years or 0.0)),
            weight=ws.weight,
            is_required=ws.weight >= 0.8,
        )
    return extraction



## micro and macro calculator functions

def microCalculator(application_uuid):
    try:
        required_skills = get_job_structured_data_for_micro(application_uuid)
        candidate_skills = get_candidate_skills_for_micro(application_uuid)
    except Exception as e:
        application.objects.filter(uuid=application_uuid).update(status='error')
        raise e
    experiencePass = calculate_final_score_with_experience(candidate_skills, required_skills, root)
    priorityPass = calculate_final_score_with_priority(candidate_skills, required_skills, root)
    microScore = experiencePass * 0.7 + priorityPass * 0.3

    application.objects.filter(uuid=application_uuid).update(micro_score=microScore)
    return microScore

def macroCalculator(application_uuid):
    app = get_object_or_404(application, uuid=application_uuid, is_deleted=False)
    ## TODO : YASSER

    macro_score = 0.7

    application.objects.filter(uuid=application_uuid).update(macro_score=macro_score)
    return macro_score

## main function to call both calculators

def calculate_score(application_uuid):
    try:
        app = get_object_or_404(application, uuid=application_uuid, is_deleted=False)
        if app.micro_score is None or app.micro_score == '' or app.micro_score == 0:
            micro_score = microCalculator(application_uuid)
        else:
            micro_score = app.micro_score

        if app.macro_score is None or app.macro_score == '' or app.macro_score == 0:
            macro_score = macroCalculator(application_uuid)
        else:
            macro_score = app.macro_score
    except Exception as e:
        application.objects.filter(uuid=application_uuid).update(status='error')
        raise e

    app = get_object_or_404(application.objects.select_related('job'),uuid=application_uuid, is_deleted=False)
    job = app.job

    micro_blend = job.micro_weight
    macro_blend = job.macro_weight
    final_score = micro_blend * micro_score + macro_blend * macro_score

    application.objects.filter(uuid=application_uuid).update(final_score=final_score, status='done')
    return final_score



## helper functions

def get_candidate_skills_for_micro(application_uuid):

    # Get the application and the associated user
    app = get_object_or_404(
        application.objects.select_related('user'),
        uuid=application_uuid,
        is_deleted=False,
    )
    user = app.user

    skills_qs = candidate_skills.objects.filter(
        user=user,
        is_deleted=False,
        resume__is_deleted = False
    )
    if not skills_qs.exists():
        raise ValueError(f"No skills found for user with application UUID: {application_uuid}")

    skills_dict = {}
    for skill in skills_qs:
        skills_dict[skill.skill_name] = {   
            'experience': skill.experience
        }
    return skills_dict

def get_job_structured_data_for_micro(application_uuid):
    app = get_object_or_404(
        application.objects.select_related('job'),
        uuid=application_uuid,
        is_deleted=False
    )
    job = app.job

    skills_qs = job_skills.objects.filter(
        job=job,
        is_deleted=False
    )
    if not skills_qs.exists():
        raise ValueError(f"No skills found for job associated with application UUID: {application_uuid}")

    required_skills = {}
    for job_skill in skills_qs:
        required_skills[job_skill.skill] = {   
            'experience': job_skill.experience,
            'priority': job_skill.weight,
            'is_required': job_skill.is_required
        }
    return required_skills