from .WuPalmerDistance import wu_palmer_distance
def calculate_nice_to_have_score(candidate_skills, required_skills, normalized_score):
    bonus_score = 0
    threshold = 0.75
    multiplier = 0.1/len(required_skills)
    if multiplier > 0.08:
        multiplier = 0.08
    if normalized_score < threshold:
        similarity_matrix = [ [0 for _ in range(len(candidate_skills))] for _ in range(len(required_skills))]
        for i, req_skill in enumerate(required_skills):
            for j, cand_skill in enumerate(candidate_skills):
                similarity_matrix[i][j] = wu_palmer_distance(req_skill, cand_skill)
        while similarity_matrix and similarity_matrix[0]:
            max_score = -1
            max_i, max_j = -1, -1
            for i in range(len(similarity_matrix)):
                for j in range(len(similarity_matrix[i])):
                    if similarity_matrix[i][j] > max_score:
                        max_score = similarity_matrix[i][j]
                        max_i, max_j = i, j
            if normalized_score < threshold:
                bonus_score += max_score * multiplier
                normalized_score += max_score * multiplier
            else:
                break
            similarity_matrix.pop(max_i)
            for row in similarity_matrix:
                row.pop(max_j)
    return bonus_score