import math
from .WuPalmerDistance import wu_palmer_distance
from .nice_to_have_skills import calculate_nice_to_have_score

# experience comes as a dictionar with skill:experience
def calculate_final_score_with_experience(candidate_skills, required_skills):

    final_score = 0
    required_names = list(required_skills.keys())
    candidate_names = list(candidate_skills.keys())
    if required_names == [] or candidate_names == [] or required_names == None or candidate_names == None:
        return print("ERROR: No skills provided")
    similarity_matrix = [ [0 for _ in range(len(candidate_names))] for _ in range(len(required_names))]
    min_len = min(len(required_skills), len(candidate_skills))
    for i, req_skill in enumerate(required_names):
        for j, cand_skill in enumerate(candidate_names):
            similarity_matrix[i][j] = wu_palmer_distance(req_skill, cand_skill)

    while similarity_matrix and similarity_matrix[0]:
        max_score = -math.inf
        max_i, max_j = -1, -1
        for i in range(len(similarity_matrix)):
            for j in range(len(similarity_matrix[i])):
                if similarity_matrix[i][j] > max_score:
                    max_score = similarity_matrix[i][j]
                    max_i, max_j = i, j

        if required_skills[required_names[max_i]]["experience"] != 0:
            candidate_exp = candidate_skills[candidate_names[max_j]]["experience"]
            required_exp = required_skills[required_names[max_i]]["experience"]

            factor = min(candidate_exp / required_exp, 1)
            final_score += max_score * factor
        else:
            final_score += max_score

        similarity_matrix.pop(max_i)
        for row in similarity_matrix:
            row.pop(max_j)
        required_names.pop(max_i)
        candidate_names.pop(max_j)

    if candidate_names:
        bonus_score = calculate_nice_to_have_score(candidate_names, required_skills.keys(), normalized_score= final_score / min_len)
        final_score += bonus_score
    return final_score / min_len

    # priority comes as a dictionary with required_skill:priority (job description)
def calculate_final_score_with_priority(candidate_skills, required_skills):

    return final_score