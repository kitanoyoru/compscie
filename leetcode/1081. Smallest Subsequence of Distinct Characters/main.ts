function smallestSubsequence(s: string): string {
  let lastOccurence = new Map<string, number>();
  for (let i = 0; i < s.length; i++) {
    lastOccurence.set(s[i], i)
  }

  const seen = new Set<string>();
  const stack = new Array<string>();

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (seen.has(c)) {
      continue;
    }

    while (
      stack.length > 0 &&
      c < stack[stack.length-1] &&
      lastOccurence.get(stack[stack.length-1])! > i
    ) {
        const top = stack.pop()!;
        seen.delete(top);
    }

    stack.push(c);
    seen.add(c);
  }

  return stack.join('');
};
