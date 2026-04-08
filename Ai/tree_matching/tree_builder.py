class tree_builder:
    def __init__(self, name):
        self.name = name
        self.parent = None
        self.specificity = 0
        self.children = []

    def add_child(self, child):
        self.specificity += 1 # Increment specificity when adding a child
        child.parent = self
        self.children.append(child)
    def __repr__(self):
        return f"tree_builder(name={self.name})"