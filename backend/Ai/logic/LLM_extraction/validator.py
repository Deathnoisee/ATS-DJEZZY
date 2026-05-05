"""
validator.py
------------
1. Verifies every extracted skill actually exists in the source text (anti-hallucination).
2. Computes the LLM success rate (taux de réussite) by comparing extracted skills
   against a reference list (e.g. from the dataset).
"""

from rapidfuzz import fuzz

SIMILARITY_THRESHOLD = 75

SOFT_SKILLS = {
    "communication", "teamwork", "leadership", "problem solving", "time management",
    "interpersonal skills", "work ethic", "adaptability", "creativity", "critical thinking",
    "attention to detail", "organization", "multitasking", "collaboration", "motivation",
    "flexibility", "punctuality", "professionalism", "strategic thinking", "strategic direction",
    "business acumen", "team leadership", "team management", "resource allocation",
    "stakeholder management", "negotiation skills", "decision making", "analytical skills",
    "self motivation", "active listening", "conflict resolution", "emotional intelligence",
}

LANGUAGES = {
    "english", "french", "arabic", "urdu", "punjabi", "tagalog", "filipino", "spanish",
    "german", "chinese", "hindi", "portuguese", "italian", "dutch", "russian", "turkish",
    "persian", "bengali", "malay", "indonesian", "swahili", "japanese", "korean",
}


def is_soft_or_language(skill: str) -> bool:
    normalized = skill.lower().strip()
    return normalized in SOFT_SKILLS or normalized in LANGUAGES


def skill_exists_in_text(skill: str, source_text: str) -> bool:
    skill_lower = skill.lower()
    source_lower = source_text.lower()

    if skill_lower in source_lower:
        return True

    words = source_lower.split()
    skill_words = skill_lower.split()
    chunk_size = len(skill_words)

    for i in range(len(words) - chunk_size + 1):
        chunk = " ".join(words[i:i + chunk_size])
        if fuzz.ratio(skill_lower, chunk) >= SIMILARITY_THRESHOLD:
            return True

    return False


def validate_extraction(extraction: dict, source_text: str) -> dict:
    valid_skills = []
    valid_weighted_skills = []
    removed_hallucinated = []
    removed_soft = []

    for ws in extraction.get("weighted_skills", []):
        skill = str(ws.get("skill", "")).strip()
        if not skill:
            continue

        if is_soft_or_language(skill):
            removed_soft.append(skill)
            continue

        if skill_exists_in_text(skill, source_text):
            valid_weighted_skills.append(ws)
            if skill in extraction.get("skills", []):
                valid_skills.append(skill)
        else:
            removed_hallucinated.append(skill)

    if removed_soft:
        print(f"[validator] Removed soft skills/languages : {removed_soft}")
    if removed_hallucinated:
        print(f"[validator] Removed hallucinated skills   : {removed_hallucinated}")
    if not removed_soft and not removed_hallucinated:
        print("[validator] All skills verified ✅")

    extraction["skills"] = valid_skills
    extraction["weighted_skills"] = valid_weighted_skills
    return extraction


def compute_success_rate(extracted_skills: list[str], expected_skills: list[str]) -> dict:
    """
    Computes the LLM extraction success rate (taux de réussite).

    Matches extracted skills against expected skills using fuzzy matching.

    Parameters
    ----------
    extracted_skills : list[str] — skills returned by the LLM + validator
    expected_skills  : list[str] — reference skills from the dataset

    Returns
    -------
    dict with:
        - matched        : list of expected skills that were found
        - missed         : list of expected skills that were NOT found
        - extra          : list of extracted skills not in expected (not wrong, just extra)
        - precision      : extracted skills that are relevant / total extracted
        - recall         : expected skills found / total expected  (taux de réussite)
        - f1             : harmonic mean of precision and recall
    """
    if not expected_skills:
        return {
            "matched": [], "missed": [], "extra": list(extracted_skills),
            "precision": 0.0, "recall": 0.0, "f1": 0.0
        }

    matched = []
    missed = []
    used_extracted = set()

    for exp in expected_skills:
        exp_lower = exp.lower()
        found = False

        for i, ext in enumerate(extracted_skills):
            if i in used_extracted:
                continue
            ext_lower = ext.lower()
            # Direct substring match or fuzzy
            if exp_lower in ext_lower or ext_lower in exp_lower:
                matched.append(exp)
                used_extracted.add(i)
                found = True
                break
            score = fuzz.ratio(exp_lower, ext_lower)
            if score >= SIMILARITY_THRESHOLD:
                matched.append(exp)
                used_extracted.add(i)
                found = True
                break

        if not found:
            missed.append(exp)

    extra = [ext for i, ext in enumerate(extracted_skills) if i not in used_extracted]

    total_expected = len(expected_skills)
    total_extracted = len(extracted_skills)

    recall    = len(matched) / total_expected if total_expected > 0 else 0.0
    precision = len(matched) / total_extracted if total_extracted > 0 else 0.0
    f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0

    return {
        "matched"  : matched,
        "missed"   : missed,
        "extra"    : extra,
        "precision": round(precision, 3),
        "recall"   : round(recall, 3),
        "f1"       : round(f1, 3),
    }