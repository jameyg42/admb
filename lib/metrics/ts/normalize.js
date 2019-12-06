const _ = require('lodash');
const _range = require('../../range')
const moment = require('moment');

//////
// the AppDynamics MetricData response both varies across AppDynamics controller releases and
// is a bit more complicated than it needs to be.  So instead of working off of the AppDynamics
// MetricData response directly, the TS package operates off a normalized version of MetricData.

const values = ['value', 'current', 'min', 'max', 'sigma'];
const valuesMap = {
    'sigma': 'standardDeviation'
}

// granularityInMinutes isn't available in all AppD versions
const granularityMap = {
    'ONE_MIN': 1,
    'TEN_MIN': 10,
    'SIXTY_MIN': 60
}

function mapValues(metricValue) {
    const r = {}
    values.forEach(v => r[v] = metricValue ? metricValue[valuesMap[v] || v] : null);
    return r;
}

function normalize(ts) {
    const normal = {
        metricId: ts.metricId,
        metricName: ts.node.path.slice(-1).pop(),
        metricFullName: ts.node.path.join('|'),
        precision: ts.granularityMinutes || granularityMap[ts.frequency],
        node: ts.node,
        range: ts.range,
        values: values,
        data: (ts.dataTimeslices || []).map(s => _.merge({start: s.startTime}, mapValues(s.metricValue)))
    }

    // the AppDynamics MetricData response doesn't handle null data points
    // consistently.  If only a subset of the data slices don't have values,
    // then a "valid" response is returned with the missing slices having a
    // null metricValue.  If the entire range doesn't have metrics, then
    // a bogus response with an empty slices array is returned and the metric
    // name equaling METRIC DATA NOT FOUND.  
    if (normal.data.length == 0) {
        const timerange = _range.fix(ts.range);
        const start = moment(timerange.startTime);
        const slices = Math.floor(moment(timerange.endTime).diff(start, 'minutes') / normal.precision);
        if (slices > 0) {
            start.subtract(normal.precision, 'minute')
            normal.data = _.range(slices).map(s => _.merge({start: start.add(normal.precision, 'minutes').valueOf()}, mapValues(null)))
        }
    }

    return normal;
}

module.exports = normalize;
