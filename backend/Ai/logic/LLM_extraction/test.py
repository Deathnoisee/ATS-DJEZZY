"""
test_extraction.py
------------------
Tests LLM extraction ONLY — no Django, no DB, no models.
Just runs the JD and CV extraction and prints the results.

Run from anywhere:
    python Ai/logic/LLM_extraction/test.py
"""

import os
import sys

# ── Add the LLM_extraction folder directly to path ───────────────────────────
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
if _THIS_DIR not in sys.path:
    sys.path.insert(0, _THIS_DIR)

from extractor import extract_from_jd, extract_from_resume, extract_soft_skills_from_jd, extract_soft_skills_from_resume
from pdf_reader import extract_text_from_pdf

# ── Test data ─────────────────────────────────────────────────────────────────

FAKE_JD = """
We are looking for a Backend Developer to join our team.
Requirements:
- 5+ years of experience with Python (mandatory)
- Strong knowledge of Django and Django REST Framework (mandatory)
- Experience with PostgreSQL and database design (mandatory)
- Proficiency in Docker and containerization (strongly preferred)
- Familiarity with Redis for caching (preferred)
- Experience with Git and CI/CD pipelines (preferred)
- Knowledge of Celery for task queues (nice to have)
- AWS or cloud experience is a plus
- React knowledge is a bonus
- Must be a great communicator and team player
- Ability to work autonomously and manage priorities under pressure
- Strong leadership skills and experience mentoring junior developers
- We value curiosity, initiative, and a results-oriented mindset
- The ideal candidate is rigorous, detail-oriented, and highly organized
- You will be expected to present technical solutions to non-technical stakeholders
- Adaptability is key as our team evolves rapidly
"""

FAKE_CV = """
John Doe - Senior Software Engineer
Email: john.doe@email.com

PROFILE
Passionate and rigorous engineer with 5 years of experience. Known for excellent communication
skills and a strong team spirit. I am autonomous, highly organized, and able to manage
multiple projects simultaneously. I enjoy mentoring junior colleagues and sharing knowledge.

SKILLS (Technical)
- Python (Django, FastAPI)
- PostgreSQL
- Docker
- Kubernetes
- REST API design
- Redis
- AWS (S3, EC2)
- JavaScript
- TypeScript

SOFT SKILLS
- Leadership et gestion d'equipe
- Esprit d'initiative et curiosite intellectuelle
- Tres bon relationnel, a l'aise a l'oral comme a l'ecrit
- Capacite d'adaptation dans des environnements changeants
- Sens des responsabilites et rigueur

WORK EXPERIENCE
Tech Lead - StartupX (2023 - 2025)
  - Led a cross-functional team of 6 engineers, coordinating deliveries and resolving conflicts
  - Proactively identified and solved architectural bottlenecks before they became critical
  - Presented quarterly roadmaps to C-level executives with clarity and confidence

Backend Engineer - TechCorp (2020 - 2023)
  - Built REST APIs using Python and Django
  - Mentored 3 junior developers, conducting weekly 1-on-1s and code reviews
  - Managed PostgreSQL databases
  - Deployed applications using Docker and Kubernetes
  - Worked with Redis for caching
  - Used AWS services for cloud infrastructure
"""

PDF_PATH = os.path.join(_THIS_DIR, "test_data", "test_cv.pdf")
SEP = "=" * 60


def print_result(label: str, result: dict):
    print(f"\n  Skills     : {result.get('skills')}")
    print(f"  Experience : {result.get('experience_years', 0)} years")
    print(f"\n  Weighted skills:")
    for ws in result.get("weighted_skills", []):
        weight = f"  weight={ws['weight']}" if "weight" in ws else ""
        print(f"    {ws['skill']:30} exp={ws.get('experience_years', 0)}y{weight}")


def print_soft_result(label: str, result: dict):
    soft = result.get("soft_skills", [])
    if not soft:
        print("  (no soft skills found)")
        return
    for entry in soft:
        print(f"  [{entry['skill']:30}]  \"{entry['context']}\"")


def match_rate(jd_result: dict, cv_result: dict):
    print(f"\n{SEP}")
    print("  MATCH RATE - JD vs CV")
    print(SEP)

    jd_skills = set(jd_result.get("skills", []))
    cv_skills  = set(cv_result.get("skills", []))
    matching   = jd_skills & cv_skills
    missing    = jd_skills - cv_skills
    extra      = cv_skills - jd_skills

    print(f"\n  Matched : {matching}")
    print(f"  Missing : {missing}")
    print(f"  Extra   : {extra}")
    print(f"  Match   : {len(matching)}/{len(jd_skills)}")
    if jd_skills:
        print(f"  Score   : {len(matching) / len(jd_skills) * 100:.1f}%")


if __name__ == "__main__":
    print(SEP)
    print("  LLM EXTRACTION TEST  (no Django)")
    print(SEP)

    # JD extraction
    print(f"\n{SEP}")
    print("  STEP 1 - JD Extraction (technical)")
    print(SEP)
    try:
        jd_result = extract_from_jd(FAKE_JD)
        print_result("JD", jd_result)
    except Exception as e:
        print(f"  JD extraction failed: {e}")
        jd_result = None

    # CV extraction from text
    print(f"\n{SEP}")
    print("  STEP 2 - CV Extraction (technical, text)")
    print(SEP)
    try:
        cv_result = extract_from_resume(FAKE_CV)
        print_result("CV", cv_result)
    except Exception as e:
        print(f"  CV extraction failed: {e}")
        cv_result = None

    # CV extraction from PDF
    print(f"\n{SEP}")
    print("  STEP 3 - CV Extraction (technical, PDF)")
    print(SEP)
    if os.path.exists(PDF_PATH):
        try:
            cv_text    = extract_text_from_pdf(PDF_PATH)
            pdf_result = extract_from_resume(cv_text)
            print_result("CV PDF", pdf_result)
        except Exception as e:
            print(f"  PDF extraction failed: {e}")
    else:
        print(f"  No PDF at {PDF_PATH} - skipping.")

    # Soft skills from JD
    print(f"\n{SEP}")
    print("  STEP 4 - Soft Skill Extraction (JD)")
    print(SEP)
    try:
        jd_soft_result = extract_soft_skills_from_jd(FAKE_JD)
        print_soft_result("JD soft", jd_soft_result)
    except Exception as e:
        print(f"  JD soft skill extraction failed: {e}")
        jd_soft_result = None

    # Soft skills from CV
    print(f"\n{SEP}")
    print("  STEP 5 - Soft Skill Extraction (CV)")
    print(SEP)
    try:
        cv_soft_result = extract_soft_skills_from_resume(FAKE_CV)
        print_soft_result("CV soft", cv_soft_result)
    except Exception as e:
        print(f"  CV soft skill extraction failed: {e}")
        cv_soft_result = None

    # Match rate (technical)
    if jd_result and cv_result:
        match_rate(jd_result, cv_result)

    print(f"\n{SEP}")
    print("  Done!")
    print(SEP)