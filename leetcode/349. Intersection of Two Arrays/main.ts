const intersection = (nums1: number[], nums2: number[]): number[] => {
    const [s1, s2] = [new Set(nums1), new Set(nums2)];

    let result = [] as number[];
    s1.forEach((val) => {
        if (s2.has(val)) {
            result.push(val);
        }
    })

    return result;
};
