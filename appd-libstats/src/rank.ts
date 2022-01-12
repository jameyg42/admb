import { sort } from "@metlife/appd-libutils/out/arrays";

export const rank = (a:number[]) => {
    const ranks = sort(a)
                  .filter((v, i, a) => i == 0 || a[i-1] != v) // dedupe - or should this be the average of dupes?
                  .reduce((r, v, i) => {
                      r[v] = i+1;
                      return r;
                  }, {});
    return a.map(v => ranks[v]);
}

export default rank;
