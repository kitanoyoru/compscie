package main

type TrieNode struct {
	isCompleted bool
	children    map[byte]*TrieNode
}

func NewTrieNode() *TrieNode {
	return &TrieNode{
		isCompleted: false,
		children:    make(map[byte]*TrieNode),
	}
}

type WordDictionary struct {
	root *TrieNode
}

func Constructor() WordDictionary {
	return WordDictionary{
		root: NewTrieNode(),
	}

}

func (this *WordDictionary) AddWord(word string) {
	cur := this.root

	for i := 0; i < len(word); i++ {
		key := word[i]
		if _, has := cur.children[key]; !has {
			cur.children[key] = NewTrieNode()
		}
		cur = cur.children[key]
	}

	cur.isCompleted = true
}

func (this *WordDictionary) Search(word string) bool {
	return this.searchHelper(this.root, word, 0)

}

func (this *WordDictionary) searchHelper(cur *TrieNode, word string, i int) bool {
	if i == len(word) {
		return cur.isCompleted
	}

	key := word[i]

	if key == '.' {
		for _, child := range cur.children {
			if this.searchHelper(child, word, i+1) {
				return true
			}
		}

		return false
	} else {
		child := cur.children[key]
		if child == nil {
			return false
		}

		return this.searchHelper(child, word, i+1)
	}
}
