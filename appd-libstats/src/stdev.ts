import { reducerOrFn, atOnceReducer } from "@metlife/appd-libutils";
import { variance } from "./variance";

export const stdev = reducerOrFn(atOnceReducer((a:number[]) => Math.sqrt(variance(a))));
export default stdev;
