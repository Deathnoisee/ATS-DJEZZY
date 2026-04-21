import requests
import json
import re
from models import ExtractionResult, save_jd_to_db, save_cv_to_db
from prompts import JD_PROMPT, CV_PROMPT
from validator import validate_extraction
from pdf_reader import extract_text_from_resume_model

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral"


def call_ollama(prompt: str) -> str:
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.0
        }
    }
    response = requests.post(OLLAMA_URL, json=payload)
    response.raise_for_status()
    return response.json()["response"]


def parse_json_response(raw: str) -> dict:
    clean = re.sub(r"```(?:json)?|```", "", raw).strip()
    return json.loads(clean)


def extract_from_jd(jd_text: str, job) -> ExtractionResult:
    """
    Extract required skills from a job description, validate them,
    then save to HR.job_skills table.

    Parameters
    ----------
    jd_text : str       — raw job description text
    job     : job_Data  — Django model instance (HR app)
    """
    prompt = JD_PROMPT.format(text=jd_text)
    raw = call_ollama(prompt)
    data = parse_json_response(raw)
    result = ExtractionResult(**data)

    # Valider et supprimer 
    result = validate_extraction(result, source_text=jd_text)

    # Save les data verifiees dans DB
    save_jd_to_db(result, job=job)

    return result


def extract_from_resume(cv_text: str, user, resume=None) -> ExtractionResult:
    """
    Extract skills from raw CV text, validate them,
    then save to candidates.candidate_skills table.

    Parameters
    ----------
    cv_text : str              — raw resume text
    user    : Users            — Django model instance (Authentication app)
    resume  : candidate_resume — Django model instance (optional)
    """
    prompt = CV_PROMPT.format(text=cv_text)
    raw = call_ollama(prompt)
    data = parse_json_response(raw)
    result = ExtractionResult(**data)
    # Valider et supprimer les faux 
    result = validate_extraction(result, source_text=cv_text)

    # Save only verified skills to DB
    save_cv_to_db(result, user=user, resume=resume)

    return result


def extract_from_resume_pdf(resume, user) -> ExtractionResult:
    """
    Full pipeline: reads PDF from a candidate_resume Django instance,
    extracts text, runs LLM extraction, validates, saves to DB.

    This is the function your friend calls from the Django view
    when a candidate uploads their CV.

    Parameters
    ----------
    resume : candidate_resume — Django model instance (has the PDF file)
    user   : Users            — Django model instance
    """
    #extract text from PDF
    cv_text = extract_text_from_resume_model(resume)
    print(f"[extractor] Extracted {len(cv_text)} characters from PDF.")

    #Run extraction et la validation et DB save
    return extract_from_resume(cv_text, user=user, resume=resume)