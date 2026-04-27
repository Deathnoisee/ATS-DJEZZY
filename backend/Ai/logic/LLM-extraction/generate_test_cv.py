"""
generate_test_cv.py
-------------------
Generates a fake CV PDF for testing the PDF extraction pipeline.
Run this once to create the test file, then use it in test_run.py.
"""

from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Helvetica", size=12)

cv_content = """John Doe - Senior Software Engineer
Email: john.doe@email.com | Phone: +1 234 567 890

EXPERIENCE
5 years of professional experience in backend development.

SKILLS
- Python (Django, FastAPI)
- PostgreSQL
- Docker
- Kubernetes
- REST API design
- Redis
- AWS (S3, EC2)
- JavaScript
- TypeScript

WORK EXPERIENCE
Backend Engineer - TechCorp (2020 - 2025)
  - Built REST APIs using Python and Django
  - Managed PostgreSQL databases
  - Deployed applications using Docker and Kubernetes
  - Worked with Redis for caching
  - Used AWS services for cloud infrastructure

EDUCATION
Bachelor of Computer Science - University of Algiers (2019)
"""

for line in cv_content.split("\n"):
    pdf.cell(0, 10, line, ln=True)

output_path = "test_data/test_cv.pdf"
pdf.output(output_path)
print(f"Test CV PDF created at: {output_path}")