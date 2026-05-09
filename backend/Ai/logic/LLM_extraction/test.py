"""
test_run.py
-----------
Simple test:
1. Extract skills from a fake JD → save to job_skills DB
2. Extract skills from a PDF CV  → save to candidate_skills DB
3. Print match rate between JD and CV skills
"""

import os
import sys
import django

# ── Django setup ──────────────────────────────────────────────────────────────
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
# ─────────────────────────────────────────────────────────────────────────────

from django.utils import timezone
from HR.models import job_Data, job_skills
from candidates.models import candidate_resume, candidate_skills
from Authentication.models import Users

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from extractor import extract_from_jd, extract_from_resume
from pdf_reader import extract_text_from_pdf

FAKE_JD = """
We are looking for a Senior Python Developer to join our team.
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
"""

PDF_PATH = os.path.join(os.path.dirname(__file__), "test_data", "test_cv.pdf")

SEP = "=" * 60


def run():
    print(SEP)
    print("  🚀 LLM EXTRACTION TEST")
    print(SEP)

    # ── Get or create a test job ──────────────────────────────────
    print("\n📋 STEP 1 — Extracting JD skills...")
    job, created = job_Data.objects.get_or_create(
        title="Senior Python Developer [TEST]",
        defaults={
            "jobs_requirement_raw": FAKE_JD,
            "job_description": FAKE_JD,
            "macro_weight": 0.5,
            "micro_weight": 0.5,
        }
    )
    if not created:
        # Reset job_description in case it changed
        job.job_description = FAKE_JD
        job.save()

    jd_result = extract_from_jd(jd_text=FAKE_JD)

    # Save to DB
    job_skills.objects.filter(job=job, is_deleted=False).update(
        is_deleted=True, deleted_at=timezone.now()
    )
    for ws in jd_result.weighted_skills:
        job_skills.objects.create(
            job=job,
            skill=ws.skill,
            experience=int(round(jd_result.experience_years or 0.0)),
            weight=ws.weight,
            is_required=ws.weight >= 0.8,
        )

    print(f"  ✅ JD skills saved: {jd_result.skills}")
    print(f"  📅 Experience req : {jd_result.experience_years} years")

    # ── Get or create a test user + resume ────────────────────────
    print("\n📄 STEP 2 — Extracting CV skills from PDF...")

    if not os.path.exists(PDF_PATH):
        print(f"  ⚠️  PDF not found at: {PDF_PATH}")
        print("     Put a test CV at test_data/test_cv.pdf and re-run.")
        return

    user, _ = Users.objects.get_or_create(
        username="test_john_doe",
        defaults={"email": "john@test.com"}
    )
    if not user.has_usable_password():
        user.set_password("testpass123")
        user.save()

    cv_text = extract_text_from_pdf(PDF_PATH)
    cv_result = extract_from_resume(cv_text)

    # Save to DB
    resume_obj = candidate_resume.objects.filter(user=user, is_deleted=False).first()

    candidate_skills.objects.filter(user=user, is_deleted=False).update(
        is_deleted=True, deleted_at=timezone.now()
    )
    for ws in cv_result.weighted_skills:
        candidate_skills.objects.create(
            user=user,
            resume=resume_obj,
            skill_name=ws.skill,
            experience=int(round(cv_result.experience_years or 0.0)),
        )

    print(f"  ✅ CV skills saved: {cv_result.skills}")
    print(f"  📅 Experience     : {cv_result.experience_years} years")

    # ── Match rate ────────────────────────────────────────────────
    print(f"\n{SEP}")
    print("  🔗 MATCH RATE — JD vs CV")
    print(SEP)

    print("\n  === Job Required Skills ===")
    for s in job_skills.objects.filter(job=job, is_deleted=False):
        print(f"  {s.skill:30} weight={s.weight}  required={s.is_required}")

    print("\n  === Candidate Skills ===")
    for s in candidate_skills.objects.filter(user=user, is_deleted=False):
        print(f"  {s.skill_name:30} experience={s.experience}")

    job_skill_names = set(
        job_skills.objects.filter(job=job, is_deleted=False).values_list('skill', flat=True)
    )
    cv_skill_names = set(
        candidate_skills.objects.filter(user=user, is_deleted=False).values_list('skill_name', flat=True)
    )

    matching = job_skill_names & cv_skill_names
    missing  = job_skill_names - cv_skill_names

    print(f"\n  ✅ Matched : {matching}")
    print(f"  ❌ Missing : {missing}")
    print(f"  📊 Match rate: {len(matching)}/{len(job_skill_names)}")
    print(f"\n  🏆 Score: {len(matching)/len(job_skill_names)*100:.1f}%" if job_skill_names else "")
    print(SEP)
    print("  ✅ Test complete. Check your DB with manage.py shell!")
    print(SEP)


if __name__ == "__main__":
    run()