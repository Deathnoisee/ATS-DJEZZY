import requests
import json
import re
import os

from dotenv import load_dotenv

try:
    from .models import ExtractionResult
    from .prompts import build_jd_prompt, build_cv_prompt, load_normalization, apply_normalization
    from .validator import validate_extraction
    from .pdf_reader import extract_text_from_resume_model
except ImportError:
    from models import ExtractionResult
    from prompts import build_jd_prompt, build_cv_prompt, load_normalization, apply_normalization
    from validator import validate_extraction
    from pdf_reader import extract_text_from_resume_model


load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError(
        "Missing GROQ_API_KEY environment variable. "
        "Set it in a .env file or in your shell before running this script."
    )
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"

# Load normalization rules once at startup
_NORM_RULES = load_normalization()


def call_ollama(prompt: str) -> str:
    """Calls the Groq API and returns the text response."""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.0
    }
    response = requests.post(GROQ_URL, headers=headers, json=payload)

    try:
        data = response.json()
    except Exception:
        raise ValueError(f"Groq returned non-JSON response: {response.text}")

    if response.status_code != 200:
        raise ValueError(f"Groq API error {response.status_code}: {data}")

    if "choices" not in data:
        raise ValueError(f"Groq response missing choices: {data}")

    return data["choices"][0]["message"]["content"]


def parse_json_response(raw: str) -> dict:
    clean = re.sub(r"```(?:json)?|```", "", raw).strip()
    return json.loads(clean)


def normalize_extraction(result: ExtractionResult) -> ExtractionResult:
    """
    Apply normalization rules to all skills in the extraction result.
    This runs in Python after the LLM responds — keeps the prompt small.
    """
    for ws in result.weighted_skills:
        ws.skill = apply_normalization(ws.skill, _NORM_RULES)

    result.skills = [
        apply_normalization(s, _NORM_RULES) for s in result.skills
    ]
    # deduplicate while preserving order
    seen = set()
    result.skills = [
        s for s in result.skills
        if not (s in seen or seen.add(s))
    ]
    return result


def extract_from_jd(jd_text: str) -> ExtractionResult:
    """Extract required skills from a job description and validate them."""
    prompt = build_jd_prompt(jd_text)
    raw = call_ollama(prompt)
    data = parse_json_response(raw)
    result = ExtractionResult(**data)
    result = normalize_extraction(result)
    result = validate_extraction(result, source_text=jd_text)
    return result


def extract_from_resume(cv_text: str) -> ExtractionResult:
    """Extract skills from raw CV text and validate them."""
    prompt = build_cv_prompt(cv_text)
    raw = call_ollama(prompt)
    data = parse_json_response(raw)
    result = ExtractionResult(**data)
    result = normalize_extraction(result)
    result = validate_extraction(result, source_text=cv_text)
    return result