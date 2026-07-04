const minScore = (n: number, roads: number[][]): number => {
  const graph: [number, number][][] = Array.from(
    { length: n + 1 },
    () => [],
  );

  for (const [u, v, w] of roads) {
    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  let answer = Infinity;
  const visited = new Set<number>();

  const dfs = (v: number): void => {
    visited.add(v);

    for (const [u, w] of graph[v]) {
      answer = Math.min(answer, w);
      
      if (!visited.has(u)) {
        dfs(u);
      }
    }
  };

  dfs(1);

  return answer;
};
