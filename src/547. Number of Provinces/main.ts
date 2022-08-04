// Solved by @kitanoyoru
// https://leetcode.com/problems/number-of-provinces/

type Queue = Array<number>

const findCircleNum = (isConnected: number[][]): number => {
  const size = isConnected.length;
  
  let visited: boolean[] = new Array(size).fill(false);
  let ans = 0;

  for (let i = 0; i < size; i++) {
    if (!visited[i]) {
      let q: Queue = [];
      q.push(i);
      ans++;

      while (q.length) {
        let node = q.pop()!;
        visited[node] = true;

        for (let j = 0; j < size; j++) {
          if (isConnected[node][j] && !visited[j]) {
            q.push(j);
          }
        }
      }
    }
  }

  return ans;
};

