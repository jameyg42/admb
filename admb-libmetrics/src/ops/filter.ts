import { runInNewContext } from 'vm';
import { MetricTimeseries, MetricTimeseriesGroup } from "../api";
import { extractValues } from "../map";
import { min, max, avg, mode, median} from "@admb/libstats";
import { merge } from '@admb/libutils';
import { matches } from "@admb/libutils/out/glob";

export const filter = (ts:MetricTimeseries, expr:string, model:any={}) => {
    const values = extractValues(ts);
    const r = runInNewContext(expr, merge({
        min: min(values),
        max: max(values),
        avg: avg(values),
        mode: mode(values),
        median: median(values),
        name: ts.name, // TODO can we add matches() to the string prototype?
        fullName: ts.fullName,
        s:[ts.source.app].concat(ts.source.path),
        matches,
        ts,
    }, model));
    return r;
}
export default filter;

export const filterGroup = (group:MetricTimeseriesGroup, expr:string, mode:('every'|'some')='some', model:any={}) => {
    if (mode == 'every') {
        return group.every(ts => filter(ts, expr, model));
    } else {
        return group.some(ts => filter(ts, expr, model));
    }
}
