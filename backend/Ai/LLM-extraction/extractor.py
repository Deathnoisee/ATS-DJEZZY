import requests
import json
import re
import os

from dotenv import load_dotenv

from models import ExtractionResult, save_jd_to_db, save_cv_to_db
from prompts import JD_PROMPT, CV_PROMPT
from validator import validate_extraction
from pdf_reader import extract_text_from_resume_model


load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"


def call_ollama(prompt: str) -> str:
    """
    This function uses Groq API.
    The name is call_ollama only because the old code used that name.
    """

    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is missing. Check your .env file.")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
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


def extract_from_jd(jd_text: str, job) -> ExtractionResult:
    """
    Extract required skills from a job description, validate them,
    then return the result.

    Parameters
    ----------
    jd_text : str
        Raw job description text.

    job : job_Data
        Django model instance.
    """

    prompt = JD_PROMPT.format(text=jd_text)

    raw = call_ollama(prompt)

    data = parse_json_response(raw)

    result = ExtractionResult(**data)

    result = validate_extraction(result, source_text=jd_text)

    return result


def extract_from_resume(cv_text: str, user, resume=None) -> ExtractionResult:
    """
    Extract skills from raw CV text, validate them,
    then return the result.

    Parameters
    ----------
    cv_text : str
        Raw resume text.

    user : Users
        Django user instance or test user.

    resume : candidate_resume
        Django resume instance, optional.
    """

    prompt = CV_PROMPT.format(text=cv_text)

    raw = call_ollama(prompt)

    data = parse_json_response(raw)

    result = ExtractionResult(**data)

    result = validate_extraction(result, source_text=cv_text)

    return result


def extract_from_resume_pdf(resume, user) -> ExtractionResult:
    """
    Full pipeline:
    1. Reads PDF from a candidate_resume Django instance.
    2. Extracts text.
    3. Runs LLM extraction.
    4. Validates result.
    5. Returns the result.

    Parameters
    ----------
    resume : candidate_resume
        Django model instance that has the PDF file.

    user : Users
        Django user instance.
    """

    cv_text = extract_text_from_resume_model(resume)

    print(f"[extractor] Extracted {len(cv_text)} characters from PDF.")

    return extract_from_resume(cv_text, user=user, resume=resume)