ENG_ALPH_SIZE = 26

ASCII_LOWER_A_LETTER = 97 

class TrieNode:
    def __init__(self) -> None:
        self.children = [None] * ENG_ALPH_SIZE 
        self.is_completed = False

class Trie:
    def __init__(self) -> None:
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        cur = self.root

        for char in word:
            pos = ord(char) - ASCII_LOWER_A_LETTER 
            if cur.children[pos] is None:
                cur.children[pos] = TrieNode() 
            cur = cur.children[pos]
        
        cur.is_completed = True
        

    def search(self, word: str) -> bool:
        cur = self.root

        for char in word:
            pos = ord(char) - ASCII_LOWER_A_LETTER
            if cur.children[pos] is None:
                return False        
            cur = cur.children[pos]

        return cur.is_completed
        

    def startsWith(self, prefix: str) -> bool:
        cur = self.root

        for char in prefix:
            pos = ord(char) - ASCII_LOWER_A_LETTER
            if cur.children[pos] is None:
                return False
            cur = cur.children[pos]

        return True
        
