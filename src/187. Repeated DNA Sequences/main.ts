// Solved by @kitanoyoru
// https://leetcode.com/problems/repeated-dna-sequences/

const findRepeatedDnaSequences = (s: string): string[] => {
  const hm = new Map<string, number>();
  
  let ans: string[] = [];
  
  for (let i = 0; i < s.length; i++) {
    const substr = s.slice(i, i + 10);
    if (hm.has(substr)) {
      hm.set(substr, hm.get(substr)! + 1);
    } else {
      hm.set(substr, 1);
    }
  }
  for (const [str, freq] of hm.entries()) {
    if (freq > 1) {
      ans.push(str);
    }
  }

  return ans;
};
