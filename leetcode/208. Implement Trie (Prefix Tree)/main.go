package main

type TrieNode struct {
	children    map[byte]*TrieNode
	isCompleted bool
}

func NewTrieNode() *TrieNode {
	return &TrieNode{
		children:    map[byte]*TrieNode{},
		isCompleted: false,
	}

}

type Trie struct {
	root *TrieNode
}

func Constructor() Trie {
	return Trie{
		root: NewTrieNode(),
	}
}

func (this *Trie) Insert(word string) {
	cur := this.root
	for i := 0; i < len(word); i++ {
		if _, contains := cur.children[word[i]]; !contains {
			cur.children[word[i]] = NewTrieNode()
		}
		cur = cur.children[word[i]]
	}

	cur.isCompleted = true
}

func (this *Trie) Search(word string) bool {
	cur := this.root
	for i := 0; i < len(word); i++ {
		if _, contains := cur.children[word[i]]; !contains {
			return false
		}
		cur = cur.children[word[i]]
	}

	return cur.isCompleted
}

func (this *Trie) StartsWith(prefix string) bool {
	cur := this.root
	for i := 0; i < len(prefix); i++ {
		if _, contains := cur.children[prefix[i]]; !contains {
			return false
		}
		cur = cur.children[prefix[i]]
	}

	return true
}

func main() {}

/**
 * Your Trie object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Insert(word);
 * param_2 := obj.Search(word);
 * param_3 := obj.StartsWith(prefix);
 */
