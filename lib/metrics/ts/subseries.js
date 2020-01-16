const _ = require('lodash');
const range = require('../services/range')
const moment = require('moment')



function _subseries(start, end, data) {
    return data.filter(ts => ts.start >= start && ts.start <= end)
}
function metricSubseries(start, end, ...series) {
    const subseries = series
        .map(_.clone)
        .map(s => {
            s.data = _subseries(start, end, s.data)
            return s;
        });
    if (series.length == 1) return subseries[0]
    return subseries;
}
function momentOrMillis(t) {
    return moment.isMoment(t) ? t.valueOf() : t;
}

module.exports = {
    subseries: metricSubseries,
    between: (s,e,d) => metricSubseries(momentOrMillis(s), momentOrMillis(e), d),
    since: (s, d) => metricSubseries(momentOrMillis(s), moment().valueOf(), d),
    inRange: (r,d) => metricSubseries(range.fix(r).startTime, range.fix(r).endTime, d),

}