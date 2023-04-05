import { App, AppServices } from "../../app";
import { Client } from "@admb/client";
import { MetricNode, Path } from "../../metrics";
import { fix, Range } from "../../range";
import { VNodeProvider, VNodeMapping, createVNode, createMapping } from "../vnodes";
import { flatten } from "lodash";

const DBMON = 'Database Monitoring';

function listMappedDatabaseBackendsForApp(client:Client, app: App, range: Range):Promise<any[]> {
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
        .then(rsp => rsp.data as any[])
        .then(dbs => dbs.filter(db => db.dbBackendStatus != 'UNMAPPED'));
}
function mapBackendToDatabase(client:Client, backendId:number):Promise<any> {
    // ecchh....this is a terrible way to get the DBMON db id, but it seems to be how the UI
    // currently does it
    return client.get<any>(`/restui/backendFlowMapUiService/backend/${backendId}?time-range=last_3_months.BEFORE_NOW.-1.-1.129600&mapId=-1&baselineId=-1`)
        .then(flowMap => {
            if (flowMap.nodes.length == 0) {
                return null;
            }
            const dbServer = flowMap.nodes[1].dbBackendInfo.server;
            return {
                id: (dbServer.id as number),
                name: (dbServer.serverName as string)
            };
        });
}
function listDatabaseBackendsAsMetrics(client:Client, app:App, path:Path, range:Range):Promise<MetricNode[]> {
    return listMappedDatabaseBackendsForApp(client, app, range)
        .then(backends => Promise.all(
            backends.map(backend => mapBackendToDatabase(client, backend.id))
        ))
        .then(databases => {
            // backends are scoped to a tier, so there will often be multiple backends for the same DB
            // unique the list here
            return databases
                .filter(d => d !== null)
                .sort((a, b) => (a.name as string).localeCompare(b.name))
                .filter((d, i, a) => i == 0 || a[i].name !== d.name);
        })
        .then(databases => databases.map(db => createVNode(db.name, app, path)))
}
function createDatabaseVNodeMapping(client:Client, path:Path): Promise<VNodeMapping[]> {
    return new AppServices(client).findApps(DBMON)
        .then(dbmon => dbmon.map(db => createMapping(db, path)));
} 

export class DatabaseVnodeProvider implements VNodeProvider {
    name = 'Databases';
    resolveVirtualNodes(client:Client, app:App, path:Path, range:Range): Promise<(MetricNode|VNodeMapping)[]> {
        if (app.name == DBMON) {
            return Promise.resolve([]);
        }
        if (path.length == 1) {
            return listDatabaseBackendsAsMetrics(client, app, path, range);
        } 
        else if (path.length > 1) {
            return createDatabaseVNodeMapping(client, path);
        }
        else {
            return Promise.resolve([]);
        }
    }
}