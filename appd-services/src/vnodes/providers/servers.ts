import { App } from "../../app";
import { Client } from "@metlife/appd-client";
import { MetricNode, Path } from "../../metrics";
import { Range, fix } from "../../range";
import { VNodeProvider, VNodeMapping, createVNode, createMapping } from "../vnodes";

const SERVERS = {id:3}; // FIXME

function listServersForApp(client:Client, app:App, path:Path, range:Range):Promise<MetricNode[]> {
    range = fix(range);
    const req = {
        "filter":{
            "appIds":[app.id],
            "nodeIds":[],"tierIds":[],"types":["PHYSICAL","CONTAINER_AWARE"],
            "timeRangeStart": range.startTime,
            "timeRangeEnd": range.endTime
        },
        "sorter":{"field":"HEALTH","direction":"ASC"}
    };
    return client.post<any>('/sim/v2/user/machines/keys', req)
        .then(rsp => rsp.machineKeys.map((k:any) => createVNode(k.serverName, app, path, 0, 'SERVER', k.machineId)))

}
function listMetricsForServer(client:Client, app:App, path:Path, range:Range):Promise<VNodeMapping[]> {
    if (path.length  < 2) return Promise.resolve([]);
    const remainder = path.slice(2);
    const mapping = createMapping(SERVERS, ['Application Infrastructure Performance', 'Root', 'Individual Nodes', path[1]].concat(remainder));
    return Promise.resolve([mapping]);
}

export class ServersVnodeProvider implements VNodeProvider {
    name = 'Servers';
    resolveVirtualNodes(client:Client, app:App, path:Path, range:Range): Promise<(MetricNode|VNodeMapping)[]> {
        if (path.length == 1) {
            return listServersForApp(client, app, path, range);
        } else {
            return listMetricsForServer(client, app, path, range);
        }
    }
}
