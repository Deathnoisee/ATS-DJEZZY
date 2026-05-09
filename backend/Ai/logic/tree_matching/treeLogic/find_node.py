def _normalize_skill_name(name):
    normalized = "".join(character.lower() for character in name.strip() if character.isalnum())

    aliases = {
        "graphicdesign": "designgraphic",
        "designgraphic": "designgraphic",
        "uiux": "uiux",
        "javascript": "javascript",
        "js": "javascript",
        "cplusplus": "ccpp",
        "c": "c",
        "csharp": "csharp",
        "fullstackdevelopment": "fullstackdevelopment",
    }

    return aliases.get(normalized, normalized)


def find_node_by_name(name, root):
    target = _normalize_skill_name(name)
    current_name = _normalize_skill_name(root.name)

    if current_name == target:
        return root

    for child in root.children:
        found = find_node_by_name(name, child)
        if found is not None:
            return found
    return None
