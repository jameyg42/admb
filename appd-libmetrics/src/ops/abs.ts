import { MetricTimeseries } from "../api";
import { mapValues } from "../map";

export const abs = (ts:MetricTimeseries) => mapValues(ts, v => v ? Math.abs(v) : v, "abs");
export default abs;
