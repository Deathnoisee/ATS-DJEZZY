def find_deepest_leaf(node):
    if not node.children:
        return node
    deepest = None
    best_depth = -1
    for child in node.children:
        cand = find_deepest_leaf(child)
        if cand.depth > best_depth:
            best_depth = cand.depth
            deepest = cand
    return deepest

def count_descendants(node):
    total = 0
    for child in node.children:
        total += 1 + count_descendants(child)
    return total

def count_nodes_in_tree(root):
    total = 1
    for child in root.children:
        total += count_nodes_in_tree(child)
    return total
