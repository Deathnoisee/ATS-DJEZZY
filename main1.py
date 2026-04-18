import os
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

DATA_DIR = "data"
JOB_FILE = os.path.join(DATA_DIR, "job.txt")

MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
model = SentenceTransformer(MODEL_NAME)

# Simple skills list for MVP explainability
SKILLS = [  
    "python", "sql", "machine learning", "scikit-learn", "data analysis",
    "statistics", "natural language processing", "nlp", "topic modelling",
    "sentiment analysis", "data visualization", "tableau", "elasticsearch",
    "kibana", "flask", "docker", "kafka", "deep learning", "word embeddings",
    "tensorflow", "pytorch", "pandas", "numpy", "matplotlib", "classification",
    "text mining", "regex"
]
SKILL_ALIASES = {
    "python": ["python"],
    "machine learning": ["machine learning", "ml"],
    "natural language processing": ["natural language processing", "nlp"],
    "scikit-learn": ["scikit-learn", "sklearn"],
    "data visualization": ["data visualization", "visualization", "dashboarding"],
}

def read_text_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read().strip()


def clean_text(text: str) -> str:
    text = text.lower()
    text = text.replace("naã¯ve", "naive")
    text = text.replace("exprience", "experience")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def get_cv_files(data_dir: str):
    files = []
    for file_name in os.listdir(data_dir):
        if file_name.lower().endswith(".txt") and file_name.lower() != "job.txt":
            files.append(file_name)
    return sorted(files)


def extract_skills(text: str):
    found = set()
    for skill in SKILLS:
        if skill in text:
            found.add(skill)
    return found


def score_label(score_percent: float) -> str:
    if score_percent >= 60:
        return "Strong match"
    elif score_percent >= 40:
        return "Medium match"
    elif score_percent >= 20:
        return "Weak match"


def main():
    if not os.path.exists(JOB_FILE):
        print("job.txt not found in data/")
        return
       
    
    cv_files = get_cv_files(DATA_DIR)
    if not cv_files:
        print("No CV txt files found in data/")
        return

    job_text_raw = read_text_file(JOB_FILE)
    job_text = clean_text(job_text_raw)
    job_skills = extract_skills(job_text)

    cv_texts = []
    cv_names = []
    cv_skills_list = []

    for cv_file in cv_files:
        cv_path = os.path.join(DATA_DIR, cv_file)
        text_raw = read_text_file(cv_path)
        text = clean_text(text_raw)

        cv_texts.append(text)
        cv_names.append(cv_file)
        cv_skills_list.append(extract_skills(text))

    all_texts = [job_text] + cv_texts
    embeddings = model.encode(all_texts)

    job_embedding = embeddings[0]
    cv_embeddings = embeddings[1:]

    results = []
    for cv_name, cv_embedding, cv_skills in zip(cv_names, cv_embeddings, cv_skills_list):
        score = cosine_similarity([job_embedding], [cv_embedding])[0][0]
        score_percent = score * 100

        matched_skills = sorted(job_skills.intersection(cv_skills))
        missing_skills = sorted(job_skills.difference(cv_skills))

        results.append({
            "name": cv_name,
            "score": score,
            "score_percent": score_percent,
            "label": score_label(score_percent),
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    print("\n==============================")
    print("   CANDIDATE RANKING RESULTS")
    print("==============================\n")

    for i, result in enumerate(results, start=1):
        print(f"{i}. {result['name']}")
        print(f"   Score: {result['score_percent']:.2f}%")
        print(f"   Verdict: {result['label']}")
        print(f"   Matched skills: {', '.join(result['matched_skills']) if result['matched_skills'] else 'None'}")
        print(f"   Missing skills: {', '.join(result['missing_skills'][:8]) if result['missing_skills'] else 'None'}")
        print()

    print("==============================")
    print("         TOP 3 CANDIDATES")
    print("==============================\n")

    for i, result in enumerate(results[:3], start=1):
        print(f"{i}. {result['name']} -> {result['score_percent']:.2f}% ({result['label']})")


if __name__ == "__main__":
    main()