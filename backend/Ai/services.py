import os

import requests
import pdfplumber


from .logic.tree_matching.ScoringLogic.scoring import calculate_final_score_with_experience, calculate_final_score_with_priority
from .logic.tree_matching.tree import build_sample_tree
from HR.models import job_Data, job_skills, job_requirements
from candidates.models import application, candidate_resume, candidate_skills
from django.shortcuts import get_object_or_404
from .logic.LLM_extraction.extractor import extract_from_resume
from .logic.LLM_extraction.pdf_reader import extract_text_from_pdf
from django.utils import timezone
root = build_sample_tree()

## LLM extraction function
def extract_skills_from_cv(resume_uuid):
    resume = get_object_or_404(candidate_resume, uuid=resume_uuid, is_deleted=False)
    user = resume.user

    cv_text = get_raw_resume_from_path(resume.resume_file.path)
    extraction = extract_from_resume(cv_text)

    if not extraction.get("weighted_skills"):
        raise ValueError(f"LLM extraction returned no skills for resume UUID: {resume_uuid}")

    if candidate_skills.objects.filter(user=user, is_deleted=False).exists():
        candidate_skills.objects.filter(user=user, is_deleted=False).update(
            is_deleted=True,
            deleted_at=timezone.now()
        )

    for ws in extraction["weighted_skills"]:
        candidate_skills.objects.create(
            user=user,
            resume=resume,
            skill_name=ws["skill"],
            experience=ws.get("experience_years", 0),
        )

    return extraction


def extract_skills_from_job_description(job_uuid):
    job = get_object_or_404(job_Data, uuid=job_uuid, is_deleted=False)

    skills = extract_from_jd(jd_text=job.jobs_requirement_raw)

    if not skills.get("weighted_skills"):
        raise ValueError(f"LLM extraction returned no skills for job UUID: {job_uuid}")

    if job_skills.objects.filter(job=job).exists():
        job_skills.objects.filter(job=job).delete()

    if job_requirements.objects.filter(job=job).exists():
        job_requirements.objects.filter(job=job).delete()

    for ws in skills["weighted_skills"]:
        job_skills.objects.create(
            job=job,
            skill=ws["skill"],
            experience=ws.get("experience_years", 0), 
            with_ai=True,
            weight=ws.get("weight", 0.0),
        )

    for macro in skills.get("macro_criteria", []):
        job_requirements.objects.create(
            job=job,
            macro_criteria=macro,
        )

    return skills


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
    app = get_object_or_404(
        application.objects.select_related('user', 'job'),
        uuid=application_uuid,
        is_deleted=False,
    )

    resume_obj = candidate_resume.objects.filter(
        user=app.user,
        is_deleted=False
    ).first()
    if not resume_obj:
        raise ValueError(f"No resume found for application UUID: {application_uuid}")

    resume_text = get_raw_resume_from_path(resume_obj.resume_file.path)

    job_description_raw = app.job.jobs_requirement_raw
    if not job_description_raw:
        raise ValueError(f"No job description found for application UUID: {application_uuid}")

    macro_criteria = macro_criteria_parser(app.job.uuid)

    API_URL = "https://favorable-sixties-glisten.ngrok-free.dev"
    HEADERS = {"ngrok-skip-browser-warning": "true"}

    r = requests.post(
        f"{API_URL}/score",
        json={
            "resume": resume_text,
            "job_description": job_description_raw,
            "macro_criteria": macro_criteria,
        },
        headers=HEADERS,
        timeout=30,
    )

    if r.status_code != 200:
        raise ValueError(
            f"LLM API scoring failed with status code: {r.status_code}, response: {r.text}"
        )

    data = r.json()
    scores = data.get("criteria_scores", [])
    macro_score = (
        sum(float(s["score"]) / 10 for s in scores) / len(scores)
        if scores else 0
    )

    application.objects.filter(uuid=application_uuid).update(macro_score=macro_score)
    return macro_score

## main function to call both calculators

def calculate_score(application_uuid):
    try:
        app = get_object_or_404(application, uuid=application_uuid, is_deleted=False)
        if app.micro_score is None or app.micro_score == '':
            micro_score = microCalculator(application_uuid)
        else:
            micro_score = app.micro_score

        if app.macro_score is None or app.macro_score == '':
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

def macro_criteria_parser(job_uuid):
    job = get_object_or_404(job_Data, uuid=job_uuid, is_deleted=False)
    reqs = job_requirements.objects.filter(job=job, is_deleted=False)
    return [r.macro_criteria for r in reqs if r.macro_criteria]

def get_raw_resume_from_path(resume_path):
    if not os.path.exists(resume_path):
        raise FileNotFoundError(f"PDF file not found: {resume_path}")

    full_text = []

    with pdfplumber.open(resume_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                full_text.append(text)
            else:
                print(f"[pdf_reader] Warning: page {i+1} has no extractable text (might be scanned image)")

    if not full_text:
        raise ValueError("Could not extract any text from the PDF. It might be a scanned image.")

    return "\n".join(full_text)