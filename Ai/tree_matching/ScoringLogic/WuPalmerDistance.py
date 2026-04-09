def wu_palmer_distance(node1, node2):
    # the wu-palmer is (2*depth(LCS)) / (depth(node1) + depth(node2))
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