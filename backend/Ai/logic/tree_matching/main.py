from backend.Ai.logic.tree_matching.treeLogic.tree_builder import tree_builder
from backend.Ai.logic.tree_matching.ScoringLogic.scoring import calculate_final_score_with_experience, calculate_final_score_with_priority


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
        #"Python": {"experience":1},
        "SQL": {"experience": 2},
        "HTML": {"experience": 1},
        "CSS": {"experience": 1},
        "Java" : {"experience": 4},
    }

    required_skills = {
        "Python": {"experience": 3, "priority": 5},
        "Java": {"experience": 2, "priority": 2},
        "SQL": {"experience": 4, "priority": 1},
    }

    experiencePass = calculate_final_score_with_experience(candidate_skills, required_skills, root)
    priorityPass = calculate_final_score_with_priority(candidate_skills, required_skills, root)
    print("-------------------------------")
    print("Experience score:", experiencePass)
    print("Priority score:", priorityPass)
    print("------------------------------")
    average_score = ((experiencePass + priorityPass) / 2 ) * 100
    experienceWeight = 0.7
    priorityWeight = 0.3
    second_average_score = ((experiencePass * experienceWeight) + (priorityPass * priorityWeight)) * 100
    print("Average score:", average_score)
    print("Weighted average score:", second_average_score)

if __name__ == "__main__":
    main()
