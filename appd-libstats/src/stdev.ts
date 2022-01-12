import { reducerOrFn, mockReducer } from "@metlife/appd-libutils/out/arrays";
import { variance } from "./variance";

export const stdev = reducerOrFn(mockReducer<number>(a => Math.sqrt(variance(a))));
export default stdev;
