def find_node_by_name(name, root):
    if root.name.lower() == name.lower():
        return root

    for child in root.children:
        found = find_node_by_name(name, child)
        if found is not None:
            return found
    return None
