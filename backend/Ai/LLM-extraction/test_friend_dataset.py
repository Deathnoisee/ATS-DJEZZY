"""
test_friend_dataset.py
----------------------
Tests the Gemini LLM extraction pipeline on 5 JSON CVs
from the friend's dataset (dataset folder).
"""

import json
import os
import sys

# ── Make sure the LLM-extraction folder is in the path ──────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from extractor import extract_from_resume
from dotenv import load_dotenv

load_dotenv()

# ── Config ───────────────────────────────────────────────────────────────────
TEST_DATA_DIR = os.path.join(os.path.dirname(__file__), "test_data", "dataset")
MAX_CVS = 5


# ── Fake user (no Django needed) ─────────────────────────────────────────────
class FakeUser:
    def __str__(self):
        return "test_user"


# ── Helpers ──────────────────────────────────────────────────────────────────
def load_json_cv(filepath: str) -> dict:
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def get_resume_text(data: dict) -> str:
    """Extract the raw resume text from the JSON structure."""
    return data.get("input", {}).get("resume", "")


def get_expected_skills(data: dict) -> list:
    """Get the skills already labeled in the dataset (for comparison)."""
    return data.get("details", {}).get("skills", [])


def get_candidate_name(data: dict) -> str:
    return data.get("output", {}).get("personal_info", {}).get("name", "Unknown")


# ── Main test ─────────────────────────────────────────────────────────────────
def run_tests():
    # Collect JSON files
    all_files = [
        f for f in os.listdir(TEST_DATA_DIR)
        if f.endswith(".json")
    ]

    if not all_files:
        print(f"❌ No JSON files found in: {TEST_DATA_DIR}")
        return

    test_files = all_files[:MAX_CVS]
    print(f"🧪 Testing {len(test_files)} CVs from: {TEST_DATA_DIR}\n")
    print("=" * 65)

    user = FakeUser()

    for i, filename in enumerate(test_files, 1):
        filepath = os.path.join(TEST_DATA_DIR, filename)
        print(f"\n[{i}/{len(test_files)}] 📄 File: {filename}")

        try:
            data = load_json_cv(filepath)
            name = get_candidate_name(data)
            resume_text = get_resume_text(data)
            expected_skills = get_expected_skills(data)

            if not resume_text:
                print(f"  ⚠️  No resume text found, skipping.")
                continue

            print(f"  👤 Candidate   : {name}")
            print(f"  📝 Resume chars: {len(resume_text)}")
            print(f"  🏷️  Expected skills (dataset): {expected_skills}")

            # Run extraction
            result = extract_from_resume(resume_text, user=user)

            print(f"  ✅ Extracted skills (Gemini): {result.skills}")
            print(f"  📅 Experience years         : {result.experience_years}")
            print(f"  ⚖️  Weighted skills:")
            for ws in result.weighted_skills:
                print(f"       - {ws.skill}: {ws.weight}")

        except Exception as e:
            print(f"  ❌ Error: {e}")
"""
test_friend_dataset.py
----------------------
Tests the Gemini LLM extraction pipeline on 5 JSON CVs
and computes the taux de réussite (success rate) for each CV
and globally.
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from extractor import extract_from_resume
from validator import compute_success_rate
from dotenv import load_dotenv

load_dotenv()

TEST_DATA_DIR = os.path.join(os.path.dirname(__file__), "test_data", "dataset")
MAX_CVS = 5


class FakeUser:
    def __str__(self):
        return "test_user"


def load_json_cv(filepath: str) -> dict:
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def get_resume_text(data: dict) -> str:
    return data.get("input", {}).get("resume", "")

def get_expected_skills(data: dict) -> list:
    return data.get("details", {}).get("skills", [])

def get_candidate_name(data: dict) -> str:
    return data.get("output", {}).get("personal_info", {}).get("name", "Unknown")


def run_tests():
    all_files = [f for f in os.listdir(TEST_DATA_DIR) if f.endswith(".json")]

    if not all_files:
        print(f"❌ No JSON files found in: {TEST_DATA_DIR}")
        return

    test_files = all_files[:MAX_CVS]
    print(f"🧪 Testing {len(test_files)} CVs\n")
    print("=" * 65)

    user = FakeUser()
    all_recalls = []
    all_precisions = []
    all_f1s = []

    for i, filename in enumerate(test_files, 1):
        filepath = os.path.join(TEST_DATA_DIR, filename)
        print(f"\n[{i}/{len(test_files)}] 📄 {filename}")

        try:
            data = load_json_cv(filepath)
            name = get_candidate_name(data)
            resume_text = get_resume_text(data)
            expected_skills = get_expected_skills(data)

            if not resume_text:
                print(f"  ⚠️  No resume text found, skipping.")
                continue

            print(f"  👤 Candidate     : {name}")
            print(f"  🏷️  Expected       : {expected_skills}")

            result = extract_from_resume(resume_text, user=user)

            print(f"  ✅ Extracted      : {result.skills}")
            print(f"  📅 Experience     : {result.experience_years} years")

            # ── Taux de réussite ──────────────────────────────────────
            rate = compute_success_rate(result.skills, expected_skills)

            print(f"\n  📊 Taux de réussite:")
            print(f"     ✔️  Matched   : {rate['matched']}")
            print(f"     ❌ Missed    : {rate['missed']}")
            print(f"     ➕ Extra     : {len(rate['extra'])} extra skills extracted")
            print(f"     🎯 Recall    : {rate['recall'] * 100:.1f}%  (expected skills found)")
            print(f"     🔬 Precision : {rate['precision'] * 100:.1f}%  (extracted skills that are relevant)")
            print(f"     ⚖️  F1 Score  : {rate['f1'] * 100:.1f}%")

            all_recalls.append(rate['recall'])
            all_precisions.append(rate['precision'])
            all_f1s.append(rate['f1'])

        except Exception as e:
            print(f"  ❌ Error: {e}")

        print("-" * 65)

    # ── Global summary ────────────────────────────────────────────────
    if all_recalls:
        avg_recall    = sum(all_recalls)    / len(all_recalls)
        avg_precision = sum(all_precisions) / len(all_precisions)
        avg_f1        = sum(all_f1s)        / len(all_f1s)

        print(f"\n{'=' * 65}")
        print(f"  🏆 GLOBAL TAUX DE RÉUSSITE ({len(all_recalls)} CVs)")
        print(f"{'=' * 65}")
        print(f"  🎯 Avg Recall    : {avg_recall * 100:.1f}%  — how many expected skills were found")
        print(f"  🔬 Avg Precision : {avg_precision * 100:.1f}%  — how many extracted skills were correct")
        print(f"  ⚖️  Avg F1 Score  : {avg_f1 * 100:.1f}%  — overall balance")
        print(f"{'=' * 65}\n")


if __name__ == "__main__":
    run_tests()
    print("-" * 65)

    print("\n✅ Done.")


if __name__ == "__main__":
    run_tests()