class tree_builder:
    def __init__(self, name):
        self.name = name
        self.parent = None
        self.depth = 0
        self.children = []

    def add_child(self, child):
        child.parent = self
        child.depth = self.depth + 1
        self.children.append(child)
    def __repr__(self):
        return self.name