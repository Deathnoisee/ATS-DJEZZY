"""
test_run.py
-----------
Simple test:
1. Extract skills from a fake JD
2. Extract skills from test_data/test_cv.pdf
3. Print match rate — no DB needed
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from extractor import extract_from_jd, extract_from_resume
from pdf_reader import extract_text_from_pdf

FAKE_JD = """
We are looking for a Backend Developer to join our team.
Requirements:
- Python: 4 years (mandatory)
- Django: 2 years (mandatory)
- PostgreSQL: 3 years (mandatory)
- Docker: 2 years (strongly preferred)
- Redis: 1 year (preferred)
- Git: 3 years (preferred)
- Celery: 1 year (nice to have)
- AWS: 2 years (a plus)
- React: 1 year (a bonus)
"""

PDF_PATH = os.path.join(os.path.dirname(__file__), "test_data", "test_cv_french.pdf")

SEP = "=" * 60


def run():
    print(SEP)
    print("  🚀 LLM EXTRACTION TEST")
    print(SEP)

    # ── Test JD extraction ────────────────────────────────────────
    print("\n📋 STEP 1 — Extracting JD skills...")
    jd_result = extract_from_jd(jd_text=FAKE_JD)
    print(f"\n  Skills         : {jd_result.skills}")
    print(f"  Experience     : {jd_result.experience_years} years")
    print(f"\n  Weighted skills:")
    for ws in jd_result.weighted_skills:
        print(f"    {ws.skill:35} weight={ws.weight}  exp={ws.experience_display()}")

    # ── Test CV extraction from PDF ───────────────────────────────
    print("\n📄 STEP 2 — Extracting CV skills from PDF...")

    if not os.path.exists(PDF_PATH):
        print(f"  ⚠️  PDF not found at: {PDF_PATH}")
        print("     Put test_cv.pdf inside the test_data/ folder and re-run.")
        return

    cv_text = extract_text_from_pdf(PDF_PATH)
    print(f"  📃 Extracted {len(cv_text)} characters from PDF")
    cv_result = extract_from_resume(cv_text)
    print(f"\n  Skills         : {cv_result.skills}")
    print(f"  Experience     : {cv_result.experience_years} years")
    print(f"\n  Weighted skills:")
    for ws in cv_result.weighted_skills:
        print(f"    {ws.skill:35} weight={ws.weight}  exp={ws.experience_display()}")

    # ── Match rate ────────────────────────────────────────────────
    print(f"\n{SEP}")
    print("  🔗 MATCH RATE — JD vs CV")
    print(SEP)

    jd_skill_names = set(ws.skill for ws in jd_result.weighted_skills)
    cv_skill_names = set(ws.skill for ws in cv_result.weighted_skills)

    matching = jd_skill_names & cv_skill_names
    missing  = jd_skill_names - cv_skill_names

    print(f"\n  ✅ Matched : {matching}")
    print(f"  ❌ Missing : {missing}")
    print(f"  📊 Match rate: {len(matching)}/{len(jd_skill_names)}")
    if jd_skill_names:
        print(f"  🏆 Score: {len(matching)/len(jd_skill_names)*100:.1f}%")
    print(SEP)
    print("  ✅ LLM extraction test complete!")
    print(SEP)


if __name__ == "__main__":
    run()