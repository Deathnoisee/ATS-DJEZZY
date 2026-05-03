import requests
import json
import re
import os

from dotenv import load_dotenv

try:
    from .models import ExtractionResult
    from .prompts import JD_PROMPT, CV_PROMPT
    from .validator import validate_extraction
    from .pdf_reader import extract_text_from_resume_model
except ImportError:
    from models import ExtractionResult
    from prompts import JD_PROMPT, CV_PROMPT
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


def call_ollama(prompt: str) -> str:
    """
    Calls the Groq API and returns the text response.
    """
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is missing. Check your .env file.")

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


def extract_from_jd(jd_text: str) -> ExtractionResult:
    """
    Extract required skills from a job description and validate them.
    DB save is handled by services.py.

    Parameters
    ----------
    jd_text : str — raw job description text.
    """
    prompt = JD_PROMPT.format(text=jd_text)
    raw = call_ollama(prompt)
    data = parse_json_response(raw)
    result = ExtractionResult(**data)
    result = validate_extraction(result, source_text=jd_text)
    return result


def extract_from_resume(cv_text: str) -> ExtractionResult:
    """
    Extract skills from raw CV text and validate them.
    DB save is handled by services.py.

    Parameters
    ----------
    cv_text : str — raw resume text.
    """
    prompt = CV_PROMPT.format(text=cv_text)
    raw = call_ollama(prompt)
    data = parse_json_response(raw)
    result = ExtractionResult(**data)
    result = validate_extraction(result, source_text=cv_text)
    return result


