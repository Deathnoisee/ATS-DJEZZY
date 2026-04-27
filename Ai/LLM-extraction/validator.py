"""
validator.py
------------
Uses rapidfuzz to verify that every skill extracted by the LLM
actually exists in the original source text (CV or JD).

This prevents hallucination — the LLM inventing skills that were
never mentioned in the text.
"""

from rapidfuzz import fuzz

# Minimum similarity score to consider a skill comme un skill correct 
SIMILARITY_THRESHOLD = 75


def skill_exists_in_text(skill: str, source_text: str) -> bool:
    """
    Checks if a skill string can be found in the source text
    using fuzzy matching.

    Returns True if the skill is found, False if it was hallucinated.
    """
    skill_lower = skill.lower()
    source_lower = source_text.lower()

    # Direct check first
    if skill_lower in source_lower:
        return True

    # Fuzzy check against each word/phrase in the text
    # Split text into chunks of similar length to the skill
    words = source_lower.split()
    skill_words = skill_lower.split()
    chunk_size = len(skill_words)

    for i in range(len(words) - chunk_size + 1):
        chunk = " ".join(words[i:i + chunk_size])
        score = fuzz.ratio(skill_lower, chunk)
        if score >= SIMILARITY_THRESHOLD:
            return True

    return False


def validate_extraction(extraction, source_text: str):
    """
    Filters out any skills from an ExtractionResult that cannot
    be found in the source text.

    Parameters
    ----------
    extraction  : ExtractionResult — output from extract_from_jd() or extract_from_resume()
    source_text : str              — the original raw text given to the LLM

    Returns
    -------
    ExtractionResult — same object but with hallucinated skills removed
    """
    valid_skills = []
    valid_weighted_skills = []
    removed = []

    for ws in extraction.weighted_skills:
        if skill_exists_in_text(ws.skill, source_text):
            valid_weighted_skills.append(ws)
            if ws.skill in extraction.skills:
                valid_skills.append(ws.skill)
        else:
            removed.append(ws.skill)

    if removed:
        print(f"[validator] Removed hallucinated skills: {removed}")
    else:
        print(f"[validator] All skills verified ✅")

    # Return a new ExtractionResult with only valid skills
    extraction.skills = valid_skills
    extraction.weighted_skills = valid_weighted_skills
    return extraction