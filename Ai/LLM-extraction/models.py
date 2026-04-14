from pydantic import BaseModel
from typing import Literal

class WeightedSkill(BaseModel):
    skill: str
    weight: float

class ExtractionResult(BaseModel):
    source: Literal["jd", "resume"]
    skills: list[str]
    experience_years: float
    weighted_skills: list[WeightedSkill]

def format_jd_output(extraction) -> dict:
    job_description = {}
    for ws in extraction.weighted_skills:
        job_description[ws.skill] = {
            "experience": extraction.experience_years,
            "weight": ws.weight
        }
    return job_description

def format_cv_output(extraction) -> dict:
    candidate_skills = {}
    for ws in extraction.weighted_skills:
        candidate_skills[ws.skill] = extraction.experience_years
    return candidate_skills