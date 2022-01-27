const _ = require('lodash');
const vnode = require('./vnode');
const _range = require('../../range');

function listDatabasesForApp(client, app, path, range) {
    range = _range.fix(range);
    
    const req = {
        requestFilter: { queryParams: { applicationId: app.id }, filters: [] },
        resultColumns: ["ID", "NAME", "TYPE"],
        offset: 0,
        limit: -1,
        searchFilters: [],
        columnSorts: [{ column: "NAME", direction: "ASC" }],
        timeRangeStart: range.startTime,
        timeRangeEnd: range.endTime
    };

    return client.post('/restui/backend/list/database', req)
        .then(dbs => dbs.data.map(db => vnode(db.name, app, path, 0, 'DATABASE', db.id)))
}
function databaseIds(client, dbIds, range) {
    range = _range.fix(range);
    const req = {
        "requestFilter":dbIds,
        "resultColumns":["TYPE","RESPONSE_TIME","CALLS","CALLS_PER_MIN","ERRORS","ERRORS_PER_MIN"],
        "offset":0,"limit":-1,"searchFilters":[],"columnSorts":[{"column":"NAME","direction":"ASC"}],
        "timeRangeStart": range.startTime,
        "timeRangeEnd": range.endTime
    };
    return client.post('/restui/backend/list/database/ids', req);
}
function listDatabaseMetricsFor(client, app, path, range) {
    return listDatabasesForApp(client, app, path.slice(0,1), range)
            .then(dbs => {
                const dbIds = dbs
                    .filter(db => db.name == path[1])
                    .map(db => db.entityId);
                return databaseIds(client, dbIds, range);
            })
            .then(dbs => dbs.data.map(db => mapDb(db, app, path)))
}
const mappings = {
    'averageResponseTime': 'Average Response Time (ms)',
    'callsPerMinute': 'Calls per Minute',
    'errorsPerMinute': 'Errors per Minute'
}
function mapDb(db, app, path) {
    return Object.entries(mappings)
        .filter(([k, n]) => db.performanceStats[k].metricId > 0)
        .map(([k, n]) => vnode(n, app, path.concat([n]), db.performanceStats[k].metricId, 'APPLICATION', app.id))
}
function findMappedDb(client, app, path, range) {
    return listDatabasesForApp(client, app, path, range)
        .then(dbs => dbs.filter(db => db.name == path[1]))
        .then(dbs => Promise.all(dbs.map(db => 
            client.get(`databasesui/databases/backendMapping/getMappedDBServer?backendId=${db.entityId}`)
            .then(rsp => {
                console.log(rsp);
                return rsp;
            })
        )))
        .then(mdbs => mdbs
            .filter(mdb => mdb)
            .map(mdb => {
                const remainder = path.slice(3);
                const mapping = {
                    mapping: {
                        app: {
                            id: 1
                        },
                        path: ['Databases', mdb.name].concat(remainder)
                    }
                }
                return mapping;
            })
        );
}

function databaseVnodes(client, app, path, range) {
    if (path.length == 1) {
        return listDatabasesForApp(client, app, path, range);
    } else if (path.length > 2 && path[2] == 'mapped') {
        return findMappedDb(client, app, path, range);
    } else {
        return listDatabaseMetricsFor(client, app, path, range);
    }
}

module.exports = databaseVnodes;
