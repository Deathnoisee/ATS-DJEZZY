from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

text1 = "Backend developer with Django and REST API experience"
text2 = "Looking for a Django backend engineer to build REST APIs"

embeddings = model.encode([text1, text2])
score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]

print("Similarity score:", score)