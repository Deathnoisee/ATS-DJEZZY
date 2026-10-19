import requests
import json
import re
import os

from dotenv import load_dotenv

# ── Imports that work whether run as a package or directly ────────────────────
try:
    from .prompts  import (build_jd_prompt, build_cv_prompt,
                           build_jd_soft_prompt, build_cv_soft_prompt,
                           load_normalization, apply_normalization)
    from .validator import validate_extraction, validate_soft_skills
except ImportError:
    from prompts   import (build_jd_prompt, build_cv_prompt,
                           build_jd_soft_prompt, build_cv_soft_prompt,
                           load_normalization, apply_normalization)
    from validator import validate_extraction, validate_soft_skills


load_dotenv()

# ── API config ────────────────────────────────────────────────────────────────


# Load normalization rules once at import time (safe — returns {} if file missing)
_NORM_RULES = load_normalization()


# ── Groq API call ─────────────────────────────────────────────────────────────

def call_groq(prompt: str) -> str:
    """Call the Groq API and return the raw text response."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is missing. Add it to your .env file.")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.0,
    }
    response = requests.post(GROQ_URL, headers=headers, json=payload)

    try:
        data = response.json()
    except Exception:
        raise ValueError(f"Groq returned non-JSON response: {response.text}")

    if response.status_code != 200:
        raise ValueError(f"Groq API error {response.status_code}: {data}")

    if "choices" not in data:
        raise ValueError(f"Groq response missing 'choices': {data}")

    return data["choices"][0]["message"]["content"]


# ── JSON parsing ──────────────────────────────────────────────────────────────

def parse_json_response(raw: str) -> dict:
    """Strip markdown fences and parse JSON."""
    clean = re.sub(r"```(?:json)?|```", "", raw).strip()
    return json.loads(clean)


# ── Post-processing: normalize every skill name ───────────────────────────────

def normalize_skills_in_data(data: dict) -> dict:
    """
    Apply alias normalization + lowercase to every skill name in the parsed dict.
    Mutates in place and returns the dict.
    """
    # Normalize top-level skills list
    data["skills"] = [
        apply_normalization(s, _NORM_RULES)
        for s in data.get("skills", [])
    ]

    # Normalize skill name inside each weighted_skills entry
    for ws in data.get("weighted_skills", []):
        if "skill" in ws:
            ws["skill"] = apply_normalization(ws["skill"], _NORM_RULES)

    return data


# ── Public extraction functions ───────────────────────────────────────────────

def extract_from_jd(jd_text: str) -> dict:
    """
    Extract required skills from a job description and validate them.
    DB save is handled by services.py.

    Parameters
    ----------
    jd_text : str — raw job description text.

    Returns
    -------
    dict — validated extraction with keys: source, skills, experience_years,
           weighted_skills.
    """
    prompt = build_jd_prompt(jd_text)
    raw    = call_groq(prompt)
    print("[extractor] raw LLM output:", raw)

    data = parse_json_response(raw)
    data = normalize_skills_in_data(data)
    print("[extractor] normalized JSON:", data)

    result = validate_extraction(data, source_text=jd_text)
    return result


def extract_from_resume(cv_text: str) -> dict:
    """
    Extract skills from raw CV text and validate them.
    DB save is handled by services.py.

    Parameters
    ----------
    cv_text : str — raw resume text.

    Returns
    -------
    dict — validated extraction with keys: source, skills, experience_years,
           weighted_skills.
    """
    prompt = build_cv_prompt(cv_text)
    raw    = call_groq(prompt)
    print("[extractor] raw LLM output:", raw)

    data = parse_json_response(raw)
    data = normalize_skills_in_data(data)
    print("[extractor] normalized JSON:", data)

    result = validate_extraction(data, source_text=cv_text)
    return result


# ── Soft skill extraction functions ──────────────────────────────────────────

def extract_soft_skills_from_jd(jd_text: str) -> dict:
    """
    Extract soft skills (with context) from a job description.

    Parameters
    ----------
    jd_text : str — raw job description text.

    Returns
    -------
    dict — validated soft skill extraction with keys:
           source, soft_skills (list of {skill, context}).
    """
    prompt = build_jd_soft_prompt(jd_text)
    raw    = call_groq(prompt)
    print("[extractor] raw soft LLM output (JD):", raw)

    data = parse_json_response(raw)
    print("[extractor] parsed soft JSON (JD):", data)

    result = validate_soft_skills(data, source_text=jd_text)
    return result


def extract_soft_skills_from_resume(cv_text: str) -> dict:
    """
    Extract soft skills (with context) from a CV/resume.

    Parameters
    ----------
    cv_text : str — raw resume text.

    Returns
    -------
    dict — validated soft skill extraction with keys:
           source, soft_skills (list of {skill, context}).
    """
    prompt = build_cv_soft_prompt(cv_text)
    raw    = call_groq(prompt)
    print("[extractor] raw soft LLM output (CV):", raw)

    data = parse_json_response(raw)
    print("[extractor] parsed soft JSON (CV):", data)

    result = validate_soft_skills(data, source_text=cv_text)
    return result