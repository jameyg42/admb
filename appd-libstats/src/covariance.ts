import { zip } from "@metlife/appd-libutils/out/arrays";
import mean from "./mean";
import rank from "./rank";
import stdev from "./stdev";
import sum from "./sum";

export const covariance = (x:number[], y:number[]) => {
    const mx = mean(x);
    const my = mean(y);
    
    return zip(x, y)
            .map(([ix, iy], i, a) => ( (ix - mx) * (iy - my) ) / a.length)
            .reduce(sum);
};
export default covariance;

export const pearson = (x:number[], y:number[]) => covariance(x, y) /  (stdev(x) * stdev(y));
export const spearman = (x:number[], y:number[]) => pearson(rank(x), rank(y));
