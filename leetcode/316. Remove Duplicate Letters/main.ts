const removeDuplicateLetters = (s: string): string => {
    const stack: string[]  = [];

    const seen = new Set<string>();
    const lastOcc: Record<string, number> = {};

    for (let i = 0; i < s.length; i++) {
        lastOcc[s[i]] = i
    }

    for (let i = 0; i < s.length; i++) {
        if (!seen.has(s[i])) {
            while (stack.length && s[i] < stack[stack.length-1] && i < lastOcc[stack[stack.length-1]]) {
                seen.delete(stack.pop()!);
            }

            seen.add(s[i])
            stack.push(s[i]);
        }
    }

    return stack.join("");
};
