from Ai.logic.tree_matching.treeLogic.find_node import find_node_by_name
from Ai.logic.tree_matching.treeLogic.node_calculations import find_deepest_leaf, count_descendants, count_nodes_in_tree
import math
# wu-palmer = (2*lca_depth) / (depth1 + depth2)
def wu_palmer_with_ic(skill1_name, skill2_name, root, alpha=0.7):
    node1 = find_node_by_name(skill1_name, root)
    node2 = find_node_by_name(skill2_name, root)

    if node1 is None or node2 is None:
        return 0.0

    lca = find_lca(node1, node2)
    if lca is None:
        return 0.0

    depth_sum = node1.depth + node2.depth
    if depth_sum == 0:
        return 1.0 if node1 is node2 else 0.0

    # your current WUP
    wup = (2 * lca.depth) / depth_sum

    spec = normalized_intrinsic_ic(lca, root)

    score = alpha * wup + (1 - alpha) * (wup * spec)
    return score
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

def intrinsic_ic(node, root):
    total_nodes = count_nodes_in_tree(root)
    descendants = count_descendants(node)

    # general nodes have many descendants
    # specific nodes have few descendants
    generality = (descendants + 1) / total_nodes

    return -math.log(generality) 

def normalized_intrinsic_ic(node, root):
    ic = intrinsic_ic(node, root)
    max_ic = intrinsic_ic(find_deepest_leaf(root), root)
    if max_ic == 0:
        return 0.0
    return ic / max_ic


