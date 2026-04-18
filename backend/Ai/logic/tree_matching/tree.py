from treeLogic.tree_builder import tree_builder

def build_sample_tree():
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

    return root