import math
from .WuPalmerDistance import wu_palmer_with_ic
from .nice_to_have_skills import calculate_nice_to_have_score

# experience comes as a dictionar with skill:experience
def calculate_final_score_with_experience(candidate_skills, required_skills, root):
    final_score = 0
    required_names = list(required_skills.keys())
    candidate_names = list(candidate_skills.keys())
    if required_names == [] or candidate_names == [] or required_names == None or candidate_names == None:
        raise ValueError("ERROR: Required skills or candidate skills are empty or None")
    similarity_matrix = [ [0 for _ in range(len(candidate_names))] for _ in range(len(required_names))]
    min_len = min(len(required_skills), len(candidate_skills))
    for i, req_skill in enumerate(required_names):
        for j, cand_skill in enumerate(candidate_names):
            similarity_matrix[i][j] = wu_palmer_with_ic(req_skill, cand_skill, root, alpha=1)
    if similarity_matrix == [] or similarity_matrix == None:
        raise ValueError("ERROR: Similarity matrix is empty")
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
        bonus_score = calculate_nice_to_have_score(candidate_names, required_skills.keys(), normalized_score= final_score / min_len, root=root)
        final_score += bonus_score
    return final_score / min_len

def calculate_final_score_with_priority(candidate_skills, required_skills, root):
    # priority comes as a dictionary with required_skill:priority (job description)
    # to be changed (too forgiving)
    # maybe try bucket priority (mandatory, important, optional)
    # if a required skill is missing beyond an acceptable semantic distance, apply a hard penalty or fail a gate ()
    # add some threshold if a required skill’s semantic match is below a threshold and that skill is high-priority, apply an extra penalty
    # if a high-priority required skill only matches weakly in the tree, do not let it score as if it were a normal partial match
    for skill, data in required_skills.items():
        if "priority" not in data:
            raise ValueError(f"Priority is missing for skill {skill}")
        if data["priority"] <= 0:
            raise ValueError(f"Priority for skill {skill} must be greater than 0")
    final_score = 0
    required_names = list(required_skills.keys())
    candidate_names = list(candidate_skills.keys())
    priority = normalize_priority_weights(required_skills)
    if required_names == [] or candidate_names == [] or required_names == None or candidate_names == None:
        raise ValueError("ERROR: Required skills or candidate skills are empty or None")
    similarity_matrix = [ [0 for _ in range(len(candidate_names))] for _ in range(len(required_names))]
    min_len = min(len(required_skills), len(candidate_skills))
    for i, req_skill in enumerate(required_names):
        for j, cand_skill in enumerate(candidate_names):
            similarity_matrix[i][j] = wu_palmer_with_ic(req_skill, cand_skill, root, alpha=1)
    if similarity_matrix == [] or similarity_matrix == None:
        raise ValueError("ERROR: Similarity matrix is empty")
    while similarity_matrix and similarity_matrix[0]:
        max_score = -math.inf
        max_i, max_j = -1, -1
        for i in range(len(similarity_matrix)):
            for j in range(len(similarity_matrix[i])):
                if similarity_matrix[i][j] > max_score:
                    max_score = similarity_matrix[i][j]
                    max_i, max_j = i, j
        #find all the required 
        final_score += max_score * priority[required_names[max_i]]
        
        similarity_matrix.pop(max_i)
        for row in similarity_matrix:
            row.pop(max_j)
        required_names.pop(max_i)
        candidate_names.pop(max_j)

    if candidate_names:
        bonus_score = calculate_nice_to_have_score(candidate_names, required_skills.keys(), normalized_score= final_score / min_len, root=root)
        final_score += bonus_score
    return final_score

def calculate_final_score_with_education(candidate_skills, required_skills, root):
    # todo: implement education scoring
    return 0.0
def normalize_priority_weights(required_skills):
    raw_weights = {}
    for skill, data in required_skills.items():
        priority = data["priority"]
        if priority <= 0:
            raise ValueError(f"ERROR: Priority for skill '{skill}' must be greater than 0")
        raw_weights[skill] = 1 / math.sqrt(priority)

    total = sum(raw_weights.values())

    normalized_weights = {}
    for skill, raw in raw_weights.items():
        normalized_weights[skill] = raw / total

    return normalized_weights
