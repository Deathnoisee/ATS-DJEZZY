from extractor import extract_from_jd, extract_from_resume
from models import format_jd_output, format_cv_output

jd_sample = """
We are looking for a senior backend engineer with 5+ years of experience.
Requirements:
- Python (required)
- PostgreSQL (required)
- Strong knowledge of Docker
- REST API design
- Kubernetes experience is a plus
"""

cv_sample = """
John Doe - Software Engineer
4 years of professional experience.
Technical skills: Python, Django, PostgreSQL, Docker, REST APIs.
Familiar with Redis and basic AWS services.
"""

jd_result = extract_from_jd(jd_sample)
cv_result = extract_from_resume(cv_sample)

job_description = format_jd_output(jd_result)
candidate_skills = format_cv_output(cv_result)

print("=== job_description ===")
print(job_description)

print("\n=== candidate_skills ===")
print(candidate_skills)