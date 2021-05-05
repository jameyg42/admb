const vnode = require('./vnode');
const _range = require('../../range');

function listServersForApp(client, app, path, range) {
    range = _range.fix(range);
    const req = {
        "filter":{
            "appIds":[app.id],
            "nodeIds":[],"tierIds":[],"types":["PHYSICAL","CONTAINER_AWARE"],
            "timeRangeStart": range.startTime,
            "timeRangeEnd": range.endTime
        },
        "sorter":{"field":"HEALTH","direction":"ASC"}
    };
    return client.post('/sim/v2/user/machines/keys', req)
        .then(rsp => rsp.machineKeys.map(k => vnode(k.serverName, app, path, 0, 'SERVER', k.machineId)))

}
function listMetricsForServer(client, app, path, range) {
    if (path.length  < 2) return [];
    const remainder = path.slice(2);
    return {
        mapping: {
            app: {
                id: 3
            },
            path: ['Application Infrastructure Performance', 'Root', 'Individual Nodes', path[1]].concat(remainder)
        }
    }
}

function serverVnodes(client, app, path, range) {
    if (path.length == 1) {
        return listServersForApp(client, app, path, range);
    } else {
        return listMetricsForServer(client, app, path, range);
    }
}

module.exports = serverVnodes;

