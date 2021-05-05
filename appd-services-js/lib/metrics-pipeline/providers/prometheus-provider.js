const axios = require('axios').default;
const glob = require('../../glob');
const _range = require('../../range');

function fetchMetrics(name, req, ctx, path) {
    if (!glob.matches(path.app, name)) {
        return Promise.resolve([]);
    }

    const query = path.path;
    const range = _range.fix(ctx.defaultRange);
    let step = '1m';
    const delta = (new Date().getTime() - range.startTime) / 1000 / 60 / 60;
    if (delta > 48) {
        step = '60m'
    } else if (delta > 8) {
        step = '10m';
    }
    return req.get('/query_range', {
        params: {
            query: query,
            start: (range.startTime / 1000),
            end: (range.endTime / 1000),
            step: step
        }
    })
    .then(rsp => rsp.data)
    .then(rsp => rsp.data.result.map(metric => createMetric(name, query, ctx.defaultRange, metric)))
}
function createMetric(name, query, range, metric) {
    const path = Object.values(metric.metric).slice(1).concat([metric.metric['__name__']]);
    return {
        name: `${name}:|${path.join('|')}`,
        app: name,
        path: path,
        value: ['value'],
        range: range,
        data: metric.values.map(v => ({
            start: v[0] * 1000,
            value: v[1]
        }))
    };
}

module.exports = (name, host) => {
console.log(name, host)
    const req = axios.create({
        baseURL: `${host}/api/v1/`,
        headers: {
            'Accept': 'application/json'
        }
    });

    return {
        fetchMetrics: (ctx, path) => fetchMetrics(name, req, ctx, path)
    }
};