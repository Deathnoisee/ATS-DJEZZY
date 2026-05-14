import json
import os

# Load normalization rules from JSON file (same directory as this file)
_NORM_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "normalization.json")

def load_normalization() -> dict:
    """Load and return the normalization dict: { alias -> canonical }."""
    with open(_NORM_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def apply_normalization(skill: str, rules: dict) -> str:
    """
    Normalize a skill name using the alias table.
    Tries exact match first, then lowercase match.
    Always returns lowercase.
    """
    skill_stripped = skill.strip()
    # exact match
    if skill_stripped in rules:
        return rules[skill_stripped].lower()
    # lowercase match
    if skill_stripped.lower() in rules:
        return rules[skill_stripped.lower()].lower()
    # no match — just lowercase it
    return skill_stripped.lower()


JD_PROMPT = """
You are a structured data extraction assistant specialized in job postings.

Your task: Extract skills, experience requirements, and skill priority weights from the job description provided.

Rules:
- Only extract skills that are EXPLICITLY mentioned in the text. Do not infer or add related skills.
- TRANSLATE every extracted skill name to English if it appears in another language (e.g. "développement web" → "web development", "gestion de projet" → "project management", "apprentissage automatique" → "machine learning").
- All skill names MUST be written in lowercase only. No uppercase letters anywhere in skill names.
  Examples: "python", "docker", "machine learning", "node.js", "postgresql", "c#", "rest api"
- Do NOT extract soft skills. This is a strict rule. Soft skills include but are not limited to:
    communication, teamwork, leadership, problem solving, time management, interpersonal skills,
    work ethic, adaptability, creativity, critical thinking, attention to detail, organization,
    multitasking, collaboration, motivation, flexibility, punctuality, professionalism,
    strategic thinking, strategic direction, business acumen, team leadership, team management,
    resource allocation, stakeholder management, negotiation, decision making, analytical skills,
    self-motivation, active listening, conflict resolution, emotional intelligence, initiative,
    project management (when used as a soft/managerial trait, not a named tool like "jira"),
    presentation skills, reporting, mentoring, coaching, planning, coordination, supervision.
  If in doubt, do NOT include it.
- Do NOT extract spoken/written human languages (English, French, Arabic, Urdu, etc.) as skills.
- experience_years (top-level): overall minimum years of professional experience required. If a range is given (e.g. "3-5 years"), take the minimum. If not mentioned, use 0.
- experience_years (per skill): years of experience for that skill, expressed as a decimal number.
  Convert months to decimal: 8 months = 0.67, 9 months = 0.75, 6 months = 0.5, 3 months = 0.25.
  Examples: "2 years 9 months" = 2.75, "1 year 6 months" = 1.5, "8 months" = 0.67.
  Look for patterns like "2 years of Django", "Python 4+ years", "5 years C#". If not explicitly mentioned for a skill, use 0.
- weight reflects how critical the skill is:
    1.0 = required, must have, mandatory
    0.8 - 0.9 = strong, solid knowledge, strongly preferred
    0.6 - 0.7 = preferred, ideally, experience with
    0.4 - 0.5 = nice to have, advantageous, a plus, experience is a plus
    0.2 - 0.3 = bonus, familiarity with, is a bonus
- Output ONLY a valid JSON object. No explanation, no markdown, no extra text.

Output format:
{{
  "source": "jd",
  "skills": ["<skill1>", "<skill2>"],
  "experience_years": <number>,
  "weighted_skills": [
    {{ "skill": "<skill1>", "weight": <0.0-1.0>, "experience_years": <number> }}
  ]
}}

Example:
Input: "Senior backend engineer. Must have: Python with 4 years experience, Django 2 years. Unity and C# mandatory with 5 years experience. Strong Docker knowledge required. Kubernetes is a plus. Must be a great communicator and team player."
Output:
{{
  "source": "jd",
  "skills": ["python", "django", "unity", "c#", "docker", "kubernetes"],
  "experience_years": 0,
  "weighted_skills": [
    {{ "skill": "python",     "weight": 1.0, "experience_years": 4 }},
    {{ "skill": "django",     "weight": 1.0, "experience_years": 2 }},
    {{ "skill": "unity",      "weight": 1.0, "experience_years": 5 }},
    {{ "skill": "c#",         "weight": 1.0, "experience_years": 5 }},
    {{ "skill": "docker",     "weight": 0.9, "experience_years": 0 }},
    {{ "skill": "kubernetes", "weight": 0.4, "experience_years": 0 }}
  ]
}}
Note: "communicator" and "team player" were correctly excluded as soft skills.

Now extract from this job description:
{text}
"""

CV_PROMPT = """
You are a structured data extraction assistant specialized in resumes and CVs.

Your task: Extract ONLY hard technical skills and domain-specific skills from the resume provided.

Rules:
- Only extract skills that are EXPLICITLY named in the text as a tool, technology, language, or methodology. Do NOT extract skills implied by context or described as a practice/concept.
  BAD examples (do NOT extract): "continuous integration", "code review", "unit testing" (unless a named tool like pytest is listed), "rest" alone (only extract if written as "REST API" and listed as a skill).
  GOOD examples (extract): "pytest", "jenkins", "github actions", "scrum", "fastapi", "docker".
- Extract ONLY hard skills: tools, technologies, programming languages, software, domain-specific methodologies, certifications, technical domains.
- TRANSLATE every extracted skill name to English if it appears in another language (e.g. "développement web" → "web development", "gestion de projet" → "project management", "apprentissage automatique" → "machine learning", "contrôle qualité" → "quality control").
- All skill names MUST be written in lowercase only. No uppercase letters anywhere in skill names.
  Examples: "python", "docker", "machine learning", "node.js", "postgresql", "c#", "rest api"
- Do NOT extract soft skills. This is a strict rule. Soft skills include but are not limited to:
    communication, teamwork, leadership, problem solving, time management, interpersonal skills,
    work ethic, adaptability, creativity, critical thinking, attention to detail, organization,
    multitasking, collaboration, motivation, flexibility, punctuality, professionalism,
    strategic thinking, strategic direction, business acumen, team leadership, team management,
    resource allocation, stakeholder management, negotiation, decision making, analytical skills,
    self-motivation, active listening, conflict resolution, emotional intelligence, initiative,
    project management (when used as a soft/managerial trait, not a named tool like "jira"),
    presentation skills, reporting, mentoring, coaching, planning, coordination, supervision.
  If in doubt, do NOT include it.
- Do NOT extract spoken/written human languages (English, French, Arabic, Urdu, Punjabi, Tagalog, etc.) as skills.
- Do NOT extract vague activity nouns unless they are a named methodology or tool: e.g. "installation" alone is NOT a skill, but "hvac installation" is acceptable if it refers to an explicit domain skill.
- experience_years (top-level): total years of overall professional experience of the candidate.
- experience_years (per skill): infer using this priority order:
  1. EXPLICIT duration tied to the skill: "Python (5 ans)", "3 years of React", "used Django since 2022" → use that value directly.
  2. NO explicit duration → look at which job section(s) EXPLICITLY mention or use the skill, and SUM only those job durations.
     IMPORTANT: Do NOT use the candidate's total career length. Only count jobs where the skill is actively mentioned.
     Example: skill appears only in "Job A (Jan 2022 – Present, 3 years)" → experience_years = 3.
     Example: skill appears in "Job A (3 years)" AND "Job B (2 years)" → experience_years = 5.
     Example: skill appears in Job A but NOT in Job B → experience_years = Job A duration only, NOT total career.
  3. Skill appears ONLY in a skills/competences section with no job tie-in → use 0.
  Convert months to decimal: 6 months = 0.5, 8 months = 0.67, 9 months = 0.75, 18 months = 1.5.
- weight is always 1.0 for resumes.
- Output ONLY a valid JSON object. No explanation, no markdown, no extra text.

Output format:
{{
  "source": "resume",
  "skills": ["<skill1>", "<skill2>"],
  "experience_years": <number>,
  "weighted_skills": [
    {{ "skill": "<skill1>", "weight": 1.0, "experience_years": <number> }}
  ]
}}

Example:
Input:
"Software engineer, 4 years total experience.
Job A (Jan 2022 – Present, 2 years): Used Django, PostgreSQL, Docker, Redis. Set up continuous integration pipelines.
Job B (Jan 2020 – Dec 2021, 2 years): Used PostgreSQL, JavaScript. Good team player and communicator.
Skills: JS 3 years, React since 2021, Node.js, k8s, TS."

Output:
{{
  "source": "resume",
  "skills": ["javascript", "react", "node.js", "postgresql", "kubernetes", "typescript", "django", "docker", "redis"],
  "experience_years": 4,
  "weighted_skills": [
    {{ "skill": "javascript",  "weight": 1.0, "experience_years": 3 }},
    {{ "skill": "react",       "weight": 1.0, "experience_years": 3 }},
    {{ "skill": "node.js",     "weight": 1.0, "experience_years": 0 }},
    {{ "skill": "postgresql",  "weight": 1.0, "experience_years": 4 }},
    {{ "skill": "kubernetes",  "weight": 1.0, "experience_years": 0 }},
    {{ "skill": "typescript",  "weight": 1.0, "experience_years": 0 }},
    {{ "skill": "django",      "weight": 1.0, "experience_years": 2 }},
    {{ "skill": "docker",      "weight": 1.0, "experience_years": 2 }},
    {{ "skill": "redis",       "weight": 1.0, "experience_years": 2 }}
  ]
}}
Notes:
- "continuous integration" was NOT extracted — it is a practice/concept, not a named tool.
- "team player" and "communicator" were NOT extracted — soft skills.
- postgresql got experience_years=4 because it appears in both Job A (2y) and Job B (2y).
- django/docker/redis got experience_years=2 from Job A's duration (only job where they appear).
- node.js/kubernetes/typescript got 0 — listed in skills section only, no job tie-in.

Now extract from this resume:
{text}
"""


def build_jd_prompt(text: str) -> str:
    return JD_PROMPT.format(text=text)


def build_cv_prompt(text: str) -> str:
    return CV_PROMPT.format(text=text)