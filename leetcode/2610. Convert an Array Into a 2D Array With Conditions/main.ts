const findMatrix = (nums: number[]): number[][] => {
    let res: number[][] = [];

    let freq = new Array(nums.length + 1).fill(0);

    for (const num of nums) {
        if (freq[num] >= res.length) {
            res.push([]);
        }

        res[freq[num]].push(num);
        freq[num]++;
    }

    return res;
};
