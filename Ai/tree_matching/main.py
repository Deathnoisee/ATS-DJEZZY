from treeLogic.tree_builder import tree_builder
from ScoringLogic.scoring import calculate_final_score_with_experience


def main():
    # Build a tiny tree
    root = tree_builder("Skills")

    cs = tree_builder("Computer Science")
    root.add_child(cs)

    backend = tree_builder("Backend")
    cs.add_child(backend)

    python_node = tree_builder("Python")
    backend.add_child(python_node)

    java_node = tree_builder("Java")
    backend.add_child(java_node)

    sql_node = tree_builder("SQL")
    backend.add_child(sql_node)

    frontend = tree_builder("Frontend")
    cs.add_child(frontend)

    html = tree_builder("HTML")
    frontend.add_child(html)

    css = tree_builder("CSS")
    frontend.add_child(css)
    # Candidate CV skills
    candidate_skills = {
        "Python": {"experience":1},
        "SQL": {"experience": 1},
        "HTML": {"experience": 1},
        "CSS": {"experience": 1},
        "Java" : {"experience": 4},
    }

    required_skills = {
        "Python": {"experience": 3, "priority": 0.9},
        "Java": {"experience": 2, "priority": 0.7},
    }

    score = calculate_final_score_with_experience(candidate_skills, required_skills, root)
    print("Experience score:", score)


if __name__ == "__main__":
    main()
