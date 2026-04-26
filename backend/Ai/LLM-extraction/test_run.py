import os
import sys
import django

# Boot Django before anything else
sys.path.insert(0, r"C:\Users\skyme\OneDrive\Desktop\Ai-Module-PFE\backend")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

# Now safe to import Django models
from Authentication.models import Users
from candidates.models import candidate_resume
from HR.models import job_Data

from extractor import extract_from_jd, extract_from_resume
from pdf_reader import extract_text_from_pdf

# Fetch real DB objects
user = Users.objects.get(email="test@test.com")
resume = candidate_resume.objects.filter(user=user).first()
job = job_Data.objects.first()


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