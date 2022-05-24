import { MetricTimeseries } from '@metlife/appd-libmetrics';
import { SearchExpressionNode } from '../lang/syntax';
import { Context } from '../rt/interpreter';

export interface MetricsProvider {
    fetchMetrics(ctx:Context, search:SearchExpressionNode): Promise<MetricTimeseries[]>
}
