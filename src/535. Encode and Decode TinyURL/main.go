// Solved by @kitanoyoru

package main

import "strconv"

type Codec struct {
	hm         map[string]string
	urlCounter int
}

func Constructor() Codec {
	return Codec{
		hm:         make(map[string]string),
		urlCounter: 0,
	}
}

// Encodes a URL to a shortened URL.
func (this *Codec) encode(longUrl string) string {
	encoded := strconv.Itoa(this.urlCounter)
	this.hm[encoded] = longUrl
	this.urlCounter++
	return encoded
}

// Decodes a shortened URL to its original URL.
func (this *Codec) decode(shortUrl string) string {
	return this.hm[shortUrl]
}

/**
 * Your Codec object will be instantiated and called as such:
 * obj := Constructor();
 * url := obj.encode(longUrl);
 * ans := obj.decode(url);
 */
