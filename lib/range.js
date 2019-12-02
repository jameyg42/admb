const moment = require('moment')

function toMinutes(duration) {
    if (moment.isDuration(duration)) {
        return duration.asMinutes();
    }    
    return duration;
}

function beforeNow(duration) {
    return {
        type: 'BEFORE_NOW',
        durationInMinutes: toMinutes(duration)
    }
}
function between(startTime, endTime) {
    startTime = moment.isMoment(startTime) ?  startTime.valueOf() : startTime;
    endTime = moment.isMoment(endTime) ? endTime.valueOf() : endTime;

    if (startTime > endTime) {
        var t = startTime;
        startTime = endTime;
        endTime = t;
    }
    return {
        type: 'BETWEEN_TIMES',
        startTime: startTime,
        endTime: endTime,
        durationInMinutes: 0
    }
}

function before(end, duration) {
    return between(end.clone().subtract(duration), end);
}
function after(start, duration) {
    return between(start, duration ? start.clone().add(duration) : moment().valueOf());
}
function fix(range) {
    if (range.type === 'BETWEEN_TIMES') return range;
    
    const now = moment();
    return before(now, moment.duration(range.durationInMinutes, 'minutes'))
}

module.exports = {
    beforeNow: beforeNow,
    between: between,
    before: before,
    after: after,
    fix: fix
}