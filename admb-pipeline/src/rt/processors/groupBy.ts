import { MetricTimeseriesGroup } from "@admb/libmetrics";
import { Arguments, BaseProcessor } from "./api";

export class GroupByProcessor extends BaseProcessor {
    execGroup(args:Arguments, series:MetricTimeseriesGroup):MetricTimeseriesGroup|Promise<MetricTimeseriesGroup> {
        const segment = args.segment;
        const rex = new RegExp(args.rex as string || '.*');

        const gs = series.reduce((a,t) => {
            const matchAgainst = segment 
                ? (segment === 'app' ? t.source.app : t.source.path[(segment as number)-1])
                : t.fullName;
            const matchAgainstFragments = rex.exec(matchAgainst) || ['##DEFAULT###'];
            const group = matchAgainstFragments.length == 1 ? matchAgainstFragments[0] : matchAgainstFragments.slice(1).join(',');
            a[group] = a[group] || [];
            a[group].push(t);
            return a;
        }, {} as any);
        return Object.values(gs);
    }
}
