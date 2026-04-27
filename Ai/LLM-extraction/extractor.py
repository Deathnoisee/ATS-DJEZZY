import requests
import json
import re
from models import ExtractionResult
from prompts import JD_PROMPT, CV_PROMPT

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

def extract_from_jd(jd_text: str) -> ExtractionResult:
    prompt = JD_PROMPT.format(text=jd_text)
    raw = call_ollama(prompt)
    data = parse_json_response(raw)
    return ExtractionResult(**data)

def extract_from_resume(cv_text: str) -> ExtractionResult:
    prompt = CV_PROMPT.format(text=cv_text)
    raw = call_ollama(prompt)
    data = parse_json_response(raw)
    return ExtractionResult(**data)