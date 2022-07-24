// Solved by @kitanoyoru
// https://leetcode.com/problems/implement-strstr/

// delegate full work to built-in method string's indexOf 
const strStrMark1 = (haystack: string, needle: string): number => {
  return needle === "" ? 0 : haystack.indexOf(needle);
};

const strStr = (haystack: string, needle: string): number => {
  if (needle === "") {
    return 0;
  }
  for (let i = 0; i < haystack.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i+j] !== needle[j]) {
        break;
      }
      if (j === needle.length - 1) {
        return i;
      }
    }
  }

  return -1;
};