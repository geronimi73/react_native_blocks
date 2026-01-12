
export function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a,b) => a + b, 0);
  return exps.map(x => x / sum);
}

export function top_k(arr, k) {
  return arr.map((v,i) => [v,i]).sort((a,b) => b[0] - a[0]).slice(0,k).map(x => x[1]);
}
