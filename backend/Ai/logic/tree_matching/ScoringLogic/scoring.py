import math
import logging
from .WuPalmerDistance import wu_palmer_with_ic
from .nice_to_have_skills import calculate_nice_to_have_score

logger = logging.getLogger(__name__)

# experience comes as a dictionar with skill:experience
def calculate_final_score_with_experience(candidate_skills, required_skills, root):
    final_score = 0
    required_names = list(required_skills.keys())
    candidate_names = list(candidate_skills.keys())

    logger.info("EXPERIENCE SCORING START")
    logger.info("Required skills: %s", required_names)
    logger.info("Candidate skills: %s", candidate_names)

    if required_names == [] or candidate_names == [] or required_names == None or candidate_names == None:
        raise ValueError("ERROR: Required skills or candidate skills are empty or None")

    similarity_matrix = [[0 for _ in range(len(candidate_names))] for _ in range(len(required_names))]
    min_len = min(len(required_skills), len(candidate_skills))

    for i, req_skill in enumerate(required_names):
        for j, cand_skill in enumerate(candidate_names):
            similarity_matrix[i][j] = wu_palmer_with_ic(req_skill, cand_skill, root, alpha=1)
            logger.debug(
                "SIM req=%s cand=%s score=%.4f",
                req_skill, cand_skill, similarity_matrix[i][j]
            )

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

        logger.info(
            "BEST MATCH req=%s cand=%s score=%.4f",
            required_names[max_i], candidate_names[max_j], max_score
        )

        if required_skills[required_names[max_i]]["experience"] != 0:
            candidate_exp = candidate_skills[candidate_names[max_j]]["experience"]
            required_exp = required_skills[required_names[max_i]]["experience"]
            factor = min(candidate_exp / required_exp, 1)

            logger.info(
                "EXPERIENCE FACTOR req=%s cand=%s candidate_exp=%s required_exp=%s factor=%.4f",
                required_names[max_i], candidate_names[max_j], candidate_exp, required_exp, factor
            )

            final_score += max_score * factor
        else:
            final_score += max_score

        logger.info("CURRENT FINAL SCORE=%.4f", final_score)

        similarity_matrix.pop(max_i)
        for row in similarity_matrix:
            row.pop(max_j)
        required_names.pop(max_i)
        candidate_names.pop(max_j)

    if candidate_names:
        logger.info("NICE TO HAVE CHECK ON REMAINING CANDIDATES: %s", candidate_names)
        bonus_score = calculate_nice_to_have_score(
            candidate_names,
            required_skills.keys(),
            normalized_score=final_score / min_len,
            root=root
        )
        logger.info("NICE TO HAVE BONUS=%.4f", bonus_score)
        final_score += bonus_score

    logger.info("EXPERIENCE FINAL SCORE=%.4f", final_score / min_len)
    return final_score / min_len


def calculate_final_score_with_priority(candidate_skills, required_skills, root):
    logger.info("PRIORITY SCORING START")

    for skill, data in required_skills.items():
        if "priority" not in data:
            raise ValueError(f"Priority is missing for skill {skill}")
        if data["priority"] <= 0:
            raise ValueError(f"Priority for skill {skill} must be greater than 0")

    final_score = 0
    required_names = list(required_skills.keys())
    candidate_names = list(candidate_skills.keys())
    priority = normalize_priority_weights(required_skills)

    logger.info("Required skills: %s", required_names)
    logger.info("Candidate skills: %s", candidate_names)
    logger.info("Normalized priority weights: %s", priority)

    if required_names == [] or candidate_names == [] or required_names == None or candidate_names == None:
        raise ValueError("ERROR: Required skills or candidate skills are empty or None")

    similarity_matrix = [[0 for _ in range(len(candidate_names))] for _ in range(len(required_names))]
    min_len = min(len(required_skills), len(candidate_skills))

    for i, req_skill in enumerate(required_names):
        for j, cand_skill in enumerate(candidate_names):
            similarity_matrix[i][j] = wu_palmer_with_ic(req_skill, cand_skill, root, alpha=1)
            logger.debug(
                "SIM req=%s cand=%s score=%.4f",
                req_skill, cand_skill, similarity_matrix[i][j]
            )

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

        logger.info(
            "BEST MATCH req=%s cand=%s score=%.4f priority=%.4f",
            required_names[max_i], candidate_names[max_j], max_score, priority[required_names[max_i]]
        )

        final_score += max_score * priority[required_names[max_i]]
        logger.info("CURRENT FINAL SCORE=%.4f", final_score)

        similarity_matrix.pop(max_i)
        for row in similarity_matrix:
            row.pop(max_j)
        required_names.pop(max_i)
        candidate_names.pop(max_j)

    if candidate_names:
        logger.info("NICE TO HAVE CHECK ON REMAINING CANDIDATES: %s", candidate_names)
        bonus_score = calculate_nice_to_have_score(
            candidate_names,
            required_skills.keys(),
            normalized_score=final_score / min_len,
            root=root
        )
        logger.info("NICE TO HAVE BONUS=%.4f", bonus_score)
        final_score += bonus_score

    logger.info("PRIORITY FINAL SCORE=%.4f", final_score)
    return final_score


def calculate_final_score_with_education(candidate_skills, required_skills, root):
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
