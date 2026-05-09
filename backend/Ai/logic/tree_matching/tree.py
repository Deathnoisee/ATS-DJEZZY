from Ai.logic.tree_matching.treeLogic.tree_builder import tree_builder


def add_children(parent, *names):
    for name in names:
        parent.add_child(tree_builder(name))


def build_sample_tree():
    root = tree_builder("Skills")

    cs = tree_builder("Computer Science")
    root.add_child(cs)

    # Languages
    programming = tree_builder("Programming Languages")
    cs.add_child(programming)
    add_children(programming, "JavaScript", "TypeScript", "Python", "Java","unity", "C#","sdl","c/c++")

    # Backend engineering
    backend = tree_builder("Backend Engineering")
    cs.add_child(backend)
    add_children(backend,"databases")

    runtime = tree_builder("Runtime & Frameworks")
    backend.add_child(runtime)
    add_children(runtime, "Node.js", "Express.js")

    api = tree_builder("API Design")
    backend.add_child(api)
    add_children(
        api,
        "REST APIs",
        "HTTP methods",
        "Third-party APIs",
        "Integrating services",
        "WebSockets",
        "Real-time communication",
    )

    concurrency = tree_builder("Concurrency")
    backend.add_child(concurrency)
    add_children(concurrency, "Async Programming", "Promises")

    code_quality = tree_builder("Code Quality")
    backend.add_child(code_quality)
    add_children(
        code_quality,
        "Clean, maintainable, and scalable code",
        "Software Architecture",
        "Design Patterns",
        "Debugging",
        "Troubleshooting",
        "Technical documentation",
        "Code reviews",
    )

    # Data / databases
    data = tree_builder("Data & Databases")
    cs.add_child(data)

    relational = tree_builder("Relational Databases")
    data.add_child(relational)

    sql = tree_builder("SQL")
    relational.add_child(sql)
    add_children(sql, "PostgreSQL", "MySQL")

    add_children(relational, "Designing database schemas", "Optimizing queries")

    nosql = tree_builder("NoSQL")
    data.add_child(nosql)
    add_children(nosql, "MongoDB")

    cache = tree_builder("Caching")
    data.add_child(cache)
    add_children(cache, "Redis", "Caching Systems")

    # Auth / security
    auth = tree_builder("Authentication & Security")
    cs.add_child(auth)

    identity = tree_builder("Identity & Sessions")
    auth.add_child(identity)
    add_children(identity, "JWT", "Sessions/Cookies", "OAuth")

    web_security = tree_builder("Web Security")
    auth.add_child(web_security)
    add_children(
        web_security,
        "Rate limiting",
        "Password hashing",
        "CORS",
        "SQL injection prevention",
        "Security Best Practices",
    )

    # DevOps / delivery
    devops = tree_builder("DevOps & Delivery")
    cs.add_child(devops)

    containers = tree_builder("Containerization")
    devops.add_child(containers)
    add_children(containers, "Docker", "Containerization")

    cloud = tree_builder("Cloud Platforms")
    devops.add_child(cloud)
    add_children(cloud, "AWS", "Azure")

    cicd = tree_builder("CI/CD")
    devops.add_child(cicd)
    add_children(cicd, "CI/CD Pipelines")

    # Git / collaboration
    workflow = tree_builder("Version Control & Collaboration")
    cs.add_child(workflow)
    add_children(workflow, "Git", "Git workflows")

    # Testing
    testing = tree_builder("Testing & QA")
    cs.add_child(testing)
    add_children(testing, "Jest", "Supertest", "Unit testing", "Integration testing")

    # Design / frontend-related extras
    design = tree_builder("Design & UI")
    cs.add_child(design)
    add_children(design, "ui/ux", "Design Graphic", "Motion Graphic", "Conception")

    # Foundations
    foundations = tree_builder("Foundations")
    cs.add_child(foundations)
    add_children(foundations, "Programmation", "Bases de Données")

    # Soft skills
    soft_skills = tree_builder("Soft Skills")
    cs.add_child(soft_skills)
    add_children(
        soft_skills,
        "Good problem-solving skills",
        "Ability to work in a team environment",
        "Strong communication skills",
        "Ability to debug and troubleshoot efficiently",
        "Willingness to learn new technologies",
        'game design',
        'game development'
    )

    # Responsibilities
    responsibilities = tree_builder("Responsibilities")
    cs.add_child(responsibilities)
    add_children(
        responsibilities,
        "Develop and maintain backend APIs",
        "Design database schemas and optimize queries",
        "Integrate third-party services and APIs",
        "Fix bugs and improve application performance",
        "Collaborate with frontend developers",
        "Write technical documentation",
        "Participate in code reviews",
    )

    mobile = tree_builder("Mobile Development")
    cs.add_child(mobile)
    add_children(mobile, "Flutter",'full-stack development', "Dart", "React Native")

    return root