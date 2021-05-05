const provider = require('../../../lib/metrics-pipeline/providers/prometheus-provider');
const _range = require('../../../lib/range');

const risc = provider('@caas', 'http://risc.prometheus.metlife.com');

const ctx = {
    defaultRange: _range.beforeNow(15)
}

const t1_path = {
    app: '@caas',
    path: 'scrape_duration_seconds{group="node.metrics",instance=~"ustry1basv0104l.met_intnet.net:9100|ustry1basv010al.met_intnet.net:9100",job="node",role="cluster.worker"}'
}

risc.fetchMetrics(ctx, t1_path).then(console.log);

