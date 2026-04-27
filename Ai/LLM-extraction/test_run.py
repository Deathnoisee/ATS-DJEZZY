from extractor import extract_from_jd, extract_from_resume
from models import format_jd_output, format_cv_output

# ── Original test ──────────────────────────────────────────
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

# ── Test 1: does it invent skills not mentioned? ───────────
jd_tricky = """
We are looking for a Python developer.
No experience required.
"""

cv_tricky = """
I am a motivated developer with experience in web technologies.
I work well in teams and learn fast.
"""

jd_result1 = extract_from_jd(jd_tricky)
cv_result1 = extract_from_resume(cv_tricky)

job_description1 = format_jd_output(jd_result1)
candidate_skills1 = format_cv_output(cv_result1)

print("\n=== Test 1 - job_description ===")
print(job_description1)
print("\n=== Test 1 - candidate_skills ===")
print(candidate_skills1)

# ── Test 2: does it get weights right? ────────────────────
jd_weights = """
We need a data scientist with 3 years of experience.
Must have: Python, Machine Learning.
Nice to have: TensorFlow.
Bonus if you know Spark.
"""

cv_weights = """
Jane Smith - Data Scientist
3 years of experience.
Skills: Python, Machine Learning, TensorFlow.
"""

jd_result2 = extract_from_jd(jd_weights)
cv_result2 = extract_from_resume(cv_weights)

job_description2 = format_jd_output(jd_result2)
candidate_skills2 = format_cv_output(cv_result2)

print("\n=== Test 2 - job_description ===")
print(job_description2)
print("\n=== Test 2 - candidate_skills ===")
print(candidate_skills2)

# ── Test 3: does it handle aliases correctly? ──────────────
jd_aliases = """
We are looking for a frontend developer with 2 years of experience.
Must have: JS, React.
Experience with TS is a plus.
"""

cv_aliases = """
Mike Johnson - Frontend Developer
2 years of experience.
Skills:  React, TypeScript, CSS.
"""

jd_result3 = extract_from_jd(jd_aliases)
cv_result3 = extract_from_resume(cv_aliases)

job_description3 = format_jd_output(jd_result3)
candidate_skills3 = format_cv_output(cv_result3)

print("\n=== Test 3 - job_description ===")
print(job_description3)
print("\n=== Test 3 - candidate_skills ===")
print(candidate_skills3)