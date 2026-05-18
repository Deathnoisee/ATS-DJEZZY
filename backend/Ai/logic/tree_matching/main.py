import json
import re
import sys
from pathlib import Path

if __package__ in {None, ""}:
    file_path = Path(__file__).resolve()
    sys.path.insert(0, str(file_path.parents[3]))

from Ai.logic.tree_matching.ScoringLogic.WuPalmerDistance import wu_palmer_with_ic
from Ai.logic.tree_matching.tree import build_sample_tree
from Ai.logic.tree_matching.treeLogic.find_node import find_node_by_name


DATASET_LIMIT = 60
SCORE_SCALE = 10.0


def normalize_text(value):
    return re.sub(r"\s+", " ", str(value).strip().lower())


def expand_skill_terms(value):
    normalized = normalize_text(value)
    if not normalized:
        return []

    terms = {normalized}
    for part in re.split(r"\(|\)|,|/|&|;|\b(?:and|or)\b", normalized):
        cleaned = normalize_text(part)
        if cleaned:
            terms.add(cleaned)

    return list(terms)


def load_json_file(file_path):
    with open(file_path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def get_dataset_files(dataset_dir, limit=DATASET_LIMIT):
    return sorted(
        dataset_dir.glob("match_*.json"),
        key=lambda path: int(path.stem.split("_")[1])
    )[:limit]


def get_candidate_skills(payload):
    details = payload.get("details", {})
    skills = details.get("skills", [])
    return [normalize_text(skill) for skill in skills if normalize_text(skill)]


def get_required_micro_criteria(payload):
    micro_dict = payload.get("input", {}).get("micro_dict", {})
    required = {}

    for criterion, weight in micro_dict.items():
        required[normalize_text(criterion)] = float(weight)

    return required


def get_target_micro_score(payload):
    scores = payload.get("output", {}).get("scores", {})
    aggregated_scores = scores.get("aggregated_scores", {})
    target_score = aggregated_scores.get("micro_scores")

    if target_score is not None:
        return float(target_score)

    micro_scores = scores.get("micro_scores", [])
    if not micro_scores:
        raise ValueError("Dataset file is missing micro score values")

    return sum(float(item["score"]) for item in micro_scores) / len(micro_scores)


def similarity_with_tree(left, right, root):
    left_terms = expand_skill_terms(left)
    right_terms = expand_skill_terms(right)
    best_score = 0.0

    for left_term in left_terms:
        if find_node_by_name(left_term, root) is None:
            continue

        for right_term in right_terms:
            if find_node_by_name(right_term, root) is None:
                continue

            score = wu_palmer_with_ic(left_term, right_term, root, alpha=1)
            if score > best_score:
                best_score = score

    return best_score


def predict_micro_score(candidate_skills, required_micro_criteria, root):
    if not candidate_skills:
        raise ValueError("Candidate skills are empty")
    if not required_micro_criteria:
        raise ValueError("Required micro criteria are empty")

    total_weight = sum(required_micro_criteria.values())
    if total_weight <= 0:
        raise ValueError("Required micro criteria weights must be positive")

    weighted_score = 0.0
    matched_details = []

    for criterion, weight in required_micro_criteria.items():
        criterion_best_score = 0.0
        for candidate_skill in candidate_skills:
            score = similarity_with_tree(criterion, candidate_skill, root)
            if score > criterion_best_score:
                criterion_best_score = score

        normalized_weight = weight / total_weight
        weighted_score += criterion_best_score * normalized_weight
        matched_details.append(
            {
                "criterion": criterion,
                "score": criterion_best_score,
                "weight": normalized_weight,
            }
        )

    return weighted_score, matched_details


def main():
    root = build_sample_tree()
    dataset_dir = Path(__file__).resolve().parents[3] / "dataset"
    dataset_files = get_dataset_files(dataset_dir)

    if not dataset_files:
        raise FileNotFoundError(f"No match_*.json files found in {dataset_dir}")

    total_absolute_error = 0.0
    evaluated_files = 0
    skipped_files = 0

    print(f"Evaluating {min(DATASET_LIMIT, len(dataset_files))} micro-criteria files")
    print("-" * 80)

    for file_path in dataset_files:
        payload = load_json_file(file_path)
        candidate_skills = get_candidate_skills(payload)
        required_micro_criteria = get_required_micro_criteria(payload)
        if not candidate_skills:
            skipped_files += 1
            print(f"{file_path.name}")
            print("  skipped: no candidate skills found in dataset input")
            continue

        target_score_10 = get_target_micro_score(payload)

        predicted_score_1, matched_details = predict_micro_score(
            candidate_skills,
            required_micro_criteria,
            root,
        )

        target_score_1 = target_score_10 / SCORE_SCALE
        predicted_score_10 = predicted_score_1 * SCORE_SCALE
        absolute_error = abs(predicted_score_1 - target_score_1)

        total_absolute_error += absolute_error
        evaluated_files += 1

        print(f"{file_path.name}")
        print(f"  target micro score:    {target_score_10:.2f}/10 ({target_score_1:.4f}/1)")
        print(f"  predicted micro score: {predicted_score_10:.2f}/10 ({predicted_score_1:.4f}/1)")
        print(f"  absolute error:        {absolute_error:.4f}")
        print(f"  matched criteria:      {len([item for item in matched_details if item['score'] > 0])}/{len(matched_details)}")

    mae = total_absolute_error / evaluated_files if evaluated_files else 0.0

    print("-" * 80)
    print(f"Evaluated files: {evaluated_files}")
    print(f"Skipped files: {skipped_files}")
    print(f"MAE (0-1 scale): {mae:.4f}")
    print(f"MAE (0-10 scale): {mae * SCORE_SCALE:.4f}")
    print(f"MAE (percentage points): {mae * 100:.2f}%")

if __name__ == "__main__":
    main()
