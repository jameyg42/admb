/**
 * "rounds" a number to the given number of decimal places.  NOTE that this works by 
 * multiplying the provided number by 10^p, so this should not be called against very
 * large numbers or with a large number of places to avoid exceeding the max numeric
 * value.
 * @param n the number to round
 * @param p the number of decimal places to round to
 * @returns 
 */
export const round = (n:number, p?:number) => {
    if (p && p > 0) {
       return Number(Math.round(n * Math.pow(10, p)) / Math.pow(10, p));
    } else {
        return Math.round(n);
    }
}
export default round;
