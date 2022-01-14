import quartiles from "./quartile";

export const bounds = (a:number[]) => {
    const [q1,q2,q3] = quartiles(a);
    const iqr = q3 - q1;

    const lowerBound = q1 - (1.5 * iqr);
    const upperBound = q3 + (1.5 * iqr);
    return [lowerBound, upperBound]
};

const fenceLower = (lower:number) => (v:number) => Math.max(lower, v);
const fenceUpper = (upper:number) => (v:number) => Math.min(upper, v);
export const outlier = (a:number[], removeLower?:boolean) => {
    const [lower,upper] = bounds(a);

    return removeLower ? a.map(fenceUpper(upper)).map(fenceLower(lower)) : a.map(fenceUpper(upper));
};
