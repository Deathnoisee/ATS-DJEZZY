class tree_builder:
    def __init__(self, name):
        self.name = name
        self.parent = None
        self.depth = 0
        self.children = []

    def add_child(self, child):
        self.depth += 1 # Increment depth when adding a child
        child.parent = self
        self.children.append(child)
    def __repr__(self):
        return f"tree_builder(name={self.name})"