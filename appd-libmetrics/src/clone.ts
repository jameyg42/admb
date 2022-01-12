import { MetricTimeseries } from "./api";

export const clone = (ts:MetricTimeseries):MetricTimeseries => {
    return JSON.parse(JSON.stringify(ts));
}
export default clone;
