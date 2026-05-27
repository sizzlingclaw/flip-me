export function popcount(x: number): number {
  let c = 0;
  while (x) {
    c += x & 1;
    x >>>= 1;
  }
  return c;
}

export interface SolveResult {
  minWeight: number;
}

export function solveGF2(matrix: number[], rhs: number, n: number): SolveResult {
  const rows = matrix.slice();
  const rhsBits = new Array<number>(n);
  for (let i = 0; i < n; i++) rhsBits[i] = (rhs >> i) & 1;

  const pivotCol: number[] = [];
  let r = 0;
  for (let c = 0; c < n && r < n; c++) {
    let pivot = -1;
    for (let i = r; i < n; i++) {
      if ((rows[i] >>> c) & 1) {
        pivot = i;
        break;
      }
    }
    if (pivot === -1) continue;
    if (pivot !== r) {
      [rows[r], rows[pivot]] = [rows[pivot], rows[r]];
      [rhsBits[r], rhsBits[pivot]] = [rhsBits[pivot], rhsBits[r]];
    }
    for (let i = 0; i < n; i++) {
      if (i !== r && ((rows[i] >>> c) & 1)) {
        rows[i] ^= rows[r];
        rhsBits[i] ^= rhsBits[r];
      }
    }
    pivotCol.push(c);
    r++;
  }

  for (let i = r; i < n; i++) {
    if (rows[i] === 0 && rhsBits[i] !== 0) return { minWeight: Infinity };
  }

  const pivotSet = new Set(pivotCol);
  const freeCols: number[] = [];
  for (let c = 0; c < n; c++) if (!pivotSet.has(c)) freeCols.push(c);

  let particular = 0;
  for (let i = 0; i < pivotCol.length; i++) {
    if (rhsBits[i]) particular |= 1 << pivotCol[i];
  }

  const basis: number[] = [];
  for (const f of freeCols) {
    let vec = 1 << f;
    for (let i = 0; i < pivotCol.length; i++) {
      if ((rows[i] >>> f) & 1) vec |= 1 << pivotCol[i];
    }
    basis.push(vec);
  }

  let minWeight = popcount(particular);
  const k = basis.length;
  if (k > 20) return { minWeight };
  const total = 1 << k;
  for (let mask = 1; mask < total; mask++) {
    let x = particular;
    for (let j = 0; j < k; j++) if (mask & (1 << j)) x ^= basis[j];
    const w = popcount(x);
    if (w < minWeight) minWeight = w;
  }
  return { minWeight };
}
