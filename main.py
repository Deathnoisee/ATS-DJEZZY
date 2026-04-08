import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

DATA_DIR = "data"
JOB_FILE = os.path.join(DATA_DIR, "job.txt")

model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")


def read_text_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read().strip()


def get_cv_files(data_dir: str):
    files = []
    for file_name in os.listdir(data_dir):
        if file_name.lower().endswith(".txt") and file_name.lower() != "job.txt":
            files.append(file_name)
    return sorted(files)


def main():
    if not os.path.exists(JOB_FILE):
        print("job.txt not found in data/")
        return

    cv_files = get_cv_files(DATA_DIR)
    if not cv_files:
        print("No CV txt files found in data/")
        return

    job_text = read_text_file(JOB_FILE)
    cv_texts = []
    cv_names = []

    for cv_file in cv_files:
        cv_path = os.path.join(DATA_DIR, cv_file)
        text = read_text_file(cv_path)
        cv_texts.append(text)
        cv_names.append(cv_file)

    all_texts = [job_text] + cv_texts
    embeddings = model.encode(all_texts)

    job_embedding = embeddings[0]
    cv_embeddings = embeddings[1:]

    results = []
    for cv_name, cv_embedding in zip(cv_names, cv_embeddings):
        score = cosine_similarity([job_embedding], [cv_embedding])[0][0]
        results.append((cv_name, score))

    results.sort(key=lambda x: x[1], reverse=True)

    print("\n=== Candidate Ranking ===\n")
    for rank, (cv_name, score) in enumerate(results, start=1):
        print(f"{rank}. {cv_name} -> {score:.4f}")

    print("\n=== Top 3 Candidates ===\n")
    for rank, (cv_name, score) in enumerate(results[:3], start=1):
        print(f"{rank}. {cv_name} -> {score:.4f}")


if __name__ == "__main__":
    main()