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

def format_jd_output(extraction) -> dict:
    job_description = {}
    for ws in extraction.weighted_skills:
        job_description[ws.skill] = {
            "experience": extraction.experience_years or 0.0,
            "weight": ws.weight
        }
    return job_description

def format_cv_output(extraction) -> dict:
    candidate_skills = {}
    for ws in extraction.weighted_skills:
        candidate_skills[ws.skill] = {
            "experience": extraction.experience_years or 0.0
        }
    return candidate_skills