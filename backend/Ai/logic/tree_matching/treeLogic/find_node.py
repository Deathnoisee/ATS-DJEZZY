import json
import os

_NORM_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..", "..", "LLM_extraction", "normalization.json"
)

def load_normalization():
    with open(os.path.abspath(_NORM_PATH), "r", encoding="utf-8") as f:
        return json.load(f)

_RULES = load_normalization()

def apply_normalization(name):
    key = str(name).strip()
    return _RULES.get(key, _RULES.get(key.lower(), key.lower()))

def find_node_by_name(name, root):
    target = apply_normalization(name)

    if apply_normalization(root.name) == target:
        return root

    for child in root.children:
        found = find_node_by_name(target, child)
        if found is not None:
            return found
    return None
