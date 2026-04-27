JD_PROMPT = """
You are a structured data extraction assistant specialized in job postings.

Your task: Extract skills, experience requirements, and skill priority weights from the job description provided.

Rules:
- Only extract skills that are EXPLICITLY mentioned in the text. Do not infer or add related skills.
- experience_years: if a range is given (e.g. "3-5 years"), take the minimum. If not mentioned, use 0.
- weight reflects how critical the skill is:
    1.0 = required, must have, mandatory
    0.8 - 0.9 = strong, solid knowledge, strongly preferred
    0.6 - 0.7 = preferred, ideally, experience with
    0.4 - 0.5 = nice to have, advantageous, a plus, experience is a plus
    0.2 - 0.3 = bonus, familiarity with, is a bonus
- Normalize skill names:
    "JS" → "JavaScript"
    "TS" → "TypeScript"
    "k8s" → "Kubernetes"
    "Postgres" → "PostgreSQL"
    "ES6" → "JavaScript"
    "Node" → "Node.js"
    "React.js" → "React"
    "Vue.js" → "Vue"
- Output ONLY a valid JSON object. No explanation, no markdown, no extra text.

Output format:
{{
  "source": "jd",
  "skills": ["<skill1>", "<skill2>"],
  "experience_years": <number>,
  "weighted_skills": [
    {{ "skill": "<skill1>", "weight": <0.0-1.0> }}
  ]
}}

Example:
Input: "Senior backend engineer, 5+ years experience. Must have: Python, PostgreSQL. Strong Docker knowledge required. Kubernetes is a plus. Familiarity with Redis is a bonus. Experience with k8s preferred. Must know JS and TS."
Output:
{{
  "source": "jd",
  "skills": ["Python", "PostgreSQL", "Docker", "Kubernetes", "Redis", "JavaScript", "TypeScript"],
  "experience_years": 5,
  "weighted_skills": [
    {{ "skill": "Python", "weight": 1.0 }},
    {{ "skill": "PostgreSQL", "weight": 1.0 }},
    {{ "skill": "Docker", "weight": 0.9 }},
    {{ "skill": "Kubernetes", "weight": 0.4 }},
    {{ "skill": "Redis", "weight": 0.2 }},
    {{ "skill": "JavaScript", "weight": 1.0 }},
    {{ "skill": "TypeScript", "weight": 1.0 }}
  ]
}}

Now extract from this job description:
{text}
"""

CV_PROMPT = """
You are a structured data extraction assistant specialized in resumes and CVs.

Your task: Extract skills and years of experience from the resume provided.

Rules:
- Only extract skills that are EXPLICITLY mentioned in the text.
- experience_years = total professional years of experience.
- weight is always 1.0 for resumes.
- Normalize skill names:
    "JS" → "JavaScript"
    "TS" → "TypeScript"
    "k8s" → "Kubernetes"
    "Postgres" → "PostgreSQL"
    "ES6" → "JavaScript"
    "Node" → "Node.js"
    "React.js" → "React"
    "Vue.js" → "Vue"
- Output ONLY a valid JSON object. No explanation, no markdown, no extra text.

Output format:
{{
  "source": "resume",
  "skills": ["<skill1>", "<skill2>"],
  "experience_years": <number>,
  "weighted_skills": [
    {{ "skill": "<skill1>", "weight": 1.0 }}
  ]
}}

Example:
Input: "Software engineer, 4 years experience. Skills: JS, React, Node.js. Familiar with Postgres. Experience with k8s and TS."
Output:
{{
  "source": "resume",
  "skills": ["JavaScript", "React", "Node.js", "PostgreSQL", "Kubernetes", "TypeScript"],
  "experience_years": 4,
  "weighted_skills": [
    {{ "skill": "JavaScript", "weight": 1.0 }},
    {{ "skill": "React", "weight": 1.0 }},
    {{ "skill": "Node.js", "weight": 1.0 }},
    {{ "skill": "PostgreSQL", "weight": 1.0 }},
    {{ "skill": "Kubernetes", "weight": 1.0 }},
    {{ "skill": "TypeScript", "weight": 1.0 }}
  ]
}}

Now extract from this resume:
{text}
"""