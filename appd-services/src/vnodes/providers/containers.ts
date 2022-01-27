import { VNodeProvider, VNodeMapping, createVNode, createMapping} from '../vnodes';
import { MetricNode, Path } from '../../metrics';
import { Range, fix } from '../../range';
import { Client } from '../../client';
import { App } from '../../app';

function listContainersForApp(client:Client, app:App, path:Path, range:Range):Promise<MetricNode[]> {
    range = fix(range);
    const req = {
        "filter":{
            "appIds":[app.id],
            "nodeIds":[],"tierIds":[],
            "types":["CONTAINER"],
            "timeRangeStart":range.startTime,
            "timeRangeEnd":range.endTime,
            "livenessStatus":"ALL"
        },"sorter":{"field":"HOST_ID","direction":"ASC"}
    };
    return client.post<any>('/sim/v2/user/machines/keys', req)
        .then(rsp => rsp.machineKeys.map((k:any) => k.machineId))
        .then(mids => 
            client.post<any>('/sim/v2/user/machines/bulk', {
                "machineIds":mids,
                "responseFormat":"FULL"
            })
        )
        .then(ms => 
            Object.values(ms.machineDTOs).map((m:any) => {
                // weird - sometimes the hierarchy contains "Containers" as the first node, sometimes
                // it doesn't
                let hierarchy = m.hierarchy;
                if (hierarchy.slice(0,1) == 'Containers') {
                    hierarchy = hierarchy.slice(1);
                }
                hierarchy.push(m.name)
                return createVNode(hierarchy.join('-'), app, path, 0, 'CONTAINER', m.name);
            })
        )
}
function listMetricsForContainer(client:Client, app:App, path:Path, range:Range):Promise<VNodeMapping[]> {
    if (path.length  < 2) return Promise.resolve([]);
    const remainder = path.slice(2);

    const hierarchy = path[1].split('-');
    const name = hierarchy.slice(-1)[0];
    const hn = (['Root', 'Containers'].concat(hierarchy.slice(0, -1)).join('|'));
    return Promise.resolve([createMapping(3, ['Application Infrastructure Performance', hn, 'Individual Nodes', name].concat(remainder))]);
}

export class ContainerVnodeProvider implements VNodeProvider {
    name = 'Containers';
    resolveVirtualNodes(client:Client, app:App, path:Path, range:Range): Promise<(MetricNode|VNodeMapping)[]> {
        if (path.length == 1) {
            return listContainersForApp(client, app, path, range);
        } else {
            return listMetricsForContainer(client, app, path, range);
        }
    }
}
