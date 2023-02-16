import { App } from "../../app";
import { Client } from "@metlife/appd-client";
import { MetricNode, Path } from "../../metrics";
import { fix, Range } from "../../range";
import { VNodeProvider, VNodeMapping, createVNode, createMapping } from "../vnodes";

const DBMON = {id:1}; // FIXME

function listDatabasesForApp(client:Client, app:App, path:Path, range:Range): Promise<MetricNode[]> {
    range = fix(range);
    
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

    return client.post<any>('/restui/backend/list/database', req)
        .then(dbs => dbs.data.map((db:any) => createVNode(db.name, app, path, 0, 'DATABASE', db.id)))
}
function databaseIds(client:Client, dbIds:number[], range:Range) {
    range = fix(range);
    const req = {
        "requestFilter":dbIds,
        "resultColumns":["TYPE","RESPONSE_TIME","CALLS","CALLS_PER_MIN","ERRORS","ERRORS_PER_MIN"],
        "offset":0,"limit":-1,"searchFilters":[],"columnSorts":[{"column":"NAME","direction":"ASC"}],
        "timeRangeStart": range.startTime,
        "timeRangeEnd": range.endTime
    };
    return client.post('/restui/backend/list/database/ids', req);
}
function listDatabaseMetricsFor(client:Client, app:App, path:Path, range:Range): Promise<MetricNode[]> {
    return listDatabasesForApp(client, app, path.slice(0,1), range)
            .then(dbs => {
                const dbIds = dbs
                    .filter((db:any) => db.name == path[1])
                    .map((db:any) => db.entityId);
                return databaseIds(client, dbIds, range);
            })
            .then((dbs:any) => dbs.data.map((db:any) => mapDb(db, app, path)))
}
const mappings = {
    'averageResponseTime': 'Average Response Time (ms)',
    'callsPerMinute': 'Calls per Minute',
    'errorsPerMinute': 'Errors per Minute'
} as any;
function mapDb(db:any, app:App, path:Path) {
    return Object.entries(mappings)
        .filter(([k, n]) => db.performanceStats[k].metricId > 0)
        .map(([k, n]:[any,any]) => createVNode(n, app, path.concat([n]), db.performanceStats[k].metricId, 'APPLICATION', app.id))
}
function findMappedDb(client:Client, app:App, path:Path, range:Range): Promise<VNodeMapping[]> {
    return listDatabasesForApp(client, app, path, range)
        .then(dbs => dbs.filter(db => db.name == path[1]))
        .then(dbs => Promise.all(dbs.map(db => 
            client.get<any>(`databasesui/databases/backendMapping/getMappedDBServer?backendId=${db.entityId}`)
        )))
        .then(mdbs => mdbs
            .filter(mdb => mdb)
            .map(mdb => {
                const remainder = path.slice(3);
                const mapping = createMapping(DBMON, ['Databases', mdb.name].concat(remainder));
                return mapping;
            })
        );
}

export class DatabaseVnodeProvider implements VNodeProvider {
    name = 'Databases';
    resolveVirtualNodes(client:Client, app:App, path:Path, range:Range): Promise<(MetricNode|VNodeMapping)[]> {
        if (path.length == 1) {
            return listDatabasesForApp(client, app, path, range);
        } else if (path.length > 2 && path[2] == 'mapped') {
            return findMappedDb(client, app, path, range);
        } else {
            return listDatabaseMetricsFor(client, app, path, range);
        }
    }
}
