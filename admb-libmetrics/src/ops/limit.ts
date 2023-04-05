import { MetricTimeseriesGroup } from "../api";

/**
 * Returns the first `<size>` members of the group.
 * @param tss
 * @param size 
 * @returns 
 */
export const limit = (tss:MetricTimeseriesGroup, size:number) => tss.slice(0, size);
export default limit;
