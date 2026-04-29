import os
import sys

if sys.version_info < (3, 12):
    raise SystemExit(
        "Python 3.12+ is required for this project. "
        "Run this script with a compatible interpreter, for example: py -3.13 test_run.py"
    )

import django

# Boot Django before anything else
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir))
sys.path.insert(0, ROOT_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

# Now safe to import Django models
from Authentication.models import Users
from candidates.models import candidate_resume
from HR.models import job_Data

from extractor import extract_from_jd, extract_from_resume
from pdf_reader import extract_text_from_pdf

# Fetch or create required DB objects
user = Users.objects.filter(email="test@test.com").first()
if user is None:
    user = Users.objects.create_user(
        email="test@test.com",
        password="Test12345",
        username="testuser",
        last_name="Test"
    )
    print("[test_run] Created fallback user test@test.com")

resume = candidate_resume.objects.filter(user=user).first()
if resume is None:
    print("[test_run] No resume record found for user; continuing with resume=None")

job = job_Data.objects.first()
if job is None:
    job = job_Data.objects.create(
        title="Senior Backend Engineer",
        jobs_requirement_raw="Backend development with Python, Django, PostgreSQL, Docker, REST API.",
        job_description="Looking for a backend engineer with Python/Django, PostgreSQL, Docker, REST API development, and cloud experience.",
    )
    print("[test_run] Created fallback job entry")


print("\n=== Test 5 - Full Example ===")

jd_real = """
We are looking for a Senior Backend Engineer to join our engineering team.

Requirements:
- 5+ years of professional experience in backend development
- Python is mandatory (Django or FastAPI)
- PostgreSQL is required for database management
- Strong knowledge of Docker for containerization
- REST API design and development is required
- Kubernetes experience is a plus
- Redis knowledge is appreciated
- AWS experience is a bonus
- JavaScript knowledge is preferred
"""

print("\n-- Job Description Extraction --")
extract_from_jd(jd_real, job=job)

print("\n-- CV PDF Extraction --")
cv_text = extract_text_from_pdf("test_data/test_cv.pdf")
extract_from_resume(cv_text, user=user, resume=resume)

print("\nNow check the DB to see how well John Doe matches this job!")