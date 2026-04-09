
from treeLogic.find_node import find_node_by_name

def wu_palmer_distance(skill1_name, skill2_name, root):
    # the wu-palmer is (2*depth(LCS)) / (depth(node1) + depth(node2))
    # TODO: find nodes using skill names
    node1 = find_node_by_name(skill1_name, root)
    node2 = find_node_by_name(skill2_name, root)
    if node1 is None or node2 is None:
        raise ValueError(f"One or both skills '{skill1_name}' and '{skill2_name}' not found in the tree")

    return (2 * find_lca(node1, node2).depth) / (node1.depth + node2.depth)

def find_lca(node1, node2):   
    ancestors1 = set()
    current = node1
    while current:
        ancestors1.add(current)
        current = current.parent
    current = node2
    while current:
        if current in ancestors1: 
            return current  
        current = current.parent

    return None 