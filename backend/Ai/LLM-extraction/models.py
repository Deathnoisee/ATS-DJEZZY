from pydantic import BaseModel
from typing import Literal, Optional



class WeightedSkill(BaseModel):
    skill: str
    weight: float


class ExtractionResult(BaseModel):
    source: Literal["jd", "resume"]
    skills: list[str]
    experience_years: Optional[float] = 0.0
    weighted_skills: list[WeightedSkill]


def save_jd_to_db(extraction: ExtractionResult, job) -> None:
    """
    Saves JD extraction results into the HR.job_skills table.

    Parameters
    ----------
    extraction : ExtractionResult  — output of extract_from_jd()
    job        : HR.job_Data       — Django model instance for the job
    """
    from django.utils import timezone
    from HR.models import job_skills

    # Soft-delete existing skills for this job before re-inserting
    job_skills.objects.filter(job=job, is_deleted=False).update(
        is_deleted=True,
        deleted_at=timezone.now()
    )

    for ws in extraction.weighted_skills:
        job_skills.objects.create(
            job=job,
            skill=ws.skill,
            experience=float((extraction.experience_years or 0.0)),
            weight=ws.weight,
            is_required=ws.weight >= 0.8,  
        )

    print(f"[DB] Saved {len(extraction.weighted_skills)} job skills for job '{job.title}'.")


def save_cv_to_db(extraction: ExtractionResult, user, resume=None) -> None:
    """
    Saves CV extraction results into the Matching.candidate_skills table.

    Parameters
    ----------
    extraction : ExtractionResult       — output of extract_from_resume()
    user       : Authentication.Users   — Django model instance for the candidate
    resume     : candidate_resume       — Django model instance (optional)
    """
    from django.utils import timezone
    from candidates.models import candidate_skills

    
    candidate_skills.objects.filter(user=user, is_deleted=False).update(
        is_deleted=True,
        deleted_at=timezone.now()
    )

    for ws in extraction.weighted_skills:
        candidate_skills.objects.create(
            user=user,
            resume=resume,
            skill_name=ws.skill,
            experience=float((extraction.experience_years or 0.0)),
        
    )


    print(f"[DB] Saved {len(extraction.weighted_skills)} candidate skills for user '{user}'.")