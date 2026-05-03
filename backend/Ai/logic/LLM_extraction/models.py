from pydantic import BaseModel
from typing import Literal, Optional


class WeightedSkill(BaseModel):
    skill: str
    weight: float
    experience_years: Optional[float] = 0.0   # per-skill experience in decimal years

    def experience_display(self) -> str:
        """Returns a human-readable experience string. e.g. '2 years 9 months', '8 months', '6 years'"""
        if not self.experience_years:
            return "—"
        total_months = round(self.experience_years * 12)
        y = total_months // 12
        m = total_months % 12
        if y == 0:
            return f"{m} months"
        if m == 0:
            return f"{y} years"
        return f"{y} years {m} months"


class ExtractionResult(BaseModel):
    source: Literal["jd", "resume"]
    skills: list[str]
    experience_years: Optional[float] = 0.0   # overall experience
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

    incoming_skills = {ws.skill: ws for ws in extraction.weighted_skills}
    existing_skills = job_skills.objects.filter(job=job, skill__in=incoming_skills.keys())
    existing_by_skill = {skill.skill: skill for skill in existing_skills}

    # Soft-delete skills no longer present in the latest extraction
    job_skills.objects.filter(job=job, is_deleted=False).exclude(
        skill__in=incoming_skills.keys()
    ).update(is_deleted=True, deleted_at=timezone.now())

    for skill, ws in incoming_skills.items():
        skill_experience = float(ws.experience_years or extraction.experience_years or 0.0)

        if skill in existing_by_skill:
            existing = existing_by_skill[skill]
            existing.experience = skill_experience
            existing.weight = ws.weight
            existing.is_required = ws.weight >= 0.8
            existing.is_deleted = False
            existing.deleted_at = None
            existing.save(update_fields=[
                "experience", "weight", "is_required",
                "is_deleted", "deleted_at", "updated_at"
            ])
        else:
            job_skills.objects.create(
                job=job,
                skill=skill,
                experience=skill_experience,
                weight=ws.weight,
                is_required=ws.weight >= 0.8,
            )

    print(f"[DB] Saved {len(incoming_skills)} job skills for job '{job.title}'.")


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
        skill_experience = float(ws.experience_years or extraction.experience_years or 0.0)

        candidate_skills.objects.create(
            user=user,
            resume=resume,
            skill_name=ws.skill,
            experience=skill_experience,
        )

    print(f"[DB] Saved {len(extraction.weighted_skills)} candidate skills for user '{user}'.")