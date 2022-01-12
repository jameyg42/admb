import quartiles from "./quartile";


export const bounds = (a:number[]) => {
    const [q1,q2,q3] = quartiles(a);
    const iqr = q3 - q1;

    const lowerBound = q1 - (1.5 * iqr);
    const upperBound = q3 + (1.5 * iqr);
    return [lowerBound, upperBound]
};

function fence(v:number, lowerBound:number, upperBound: number) {
    return Math.max(lowerBound, Math.min(upperBound, v));
}

export const outlier = (a:number[]) => {
    const [lower,upper] = bounds(a);
    return a.map(e => fence(e, lower, upper))
};
