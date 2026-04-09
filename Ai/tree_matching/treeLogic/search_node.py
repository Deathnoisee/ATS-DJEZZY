def find_node(root, target_name):
    if root.name == target_name:
        return root
    for child in root.children:
        result = find_node(child, target_name)
        if result is not None:
            return result
    return None