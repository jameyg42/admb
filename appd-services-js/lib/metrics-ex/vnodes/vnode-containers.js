const vnode = require('./vnode');
const _range = require('../../range');

function listContainersForApp(client, app, path, range) {
    range = _range.fix(range);
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
    return client.post('/sim/v2/user/machines/keys', req)
        .then(rsp => rsp.machineKeys.map(k => k.machineId))
        .then(mids => 
            client.post('/sim/v2/user/machines/bulk', {
                "machineIds":mids,
                "responseFormat":"FULL"
            })
        )
        .then(ms => 
            Object.values(ms.machineDTOs).map(m => {
                // weird - sometimes the hierarchy contains "Containers" as the first node, sometimes
                // it doesn't
                let hierarchy = m.hierarchy;
                if (hierarchy.slice(0,1) == 'Containers') {
                    hierarchy = hierarchy.slice(1);
                }
                hierarchy.push(m.name)
                return vnode(hierarchy.join('-'), app, path, 0, 'CONTAINER', m.name);
            })
        )
        

}
function listMetricsForContainer(client, app, path, range) {
    if (path.length  < 2) return [];
    const remainder = path.slice(2);

    const hierarchy = path[1].split('-');
    const name = hierarchy.slice(-1)[0];
    const hn = (['Root', 'Containers'].concat(hierarchy.slice(0, -1)).join('|'));
    const mapping = {
        mapping: {
            app: {
                id: 3
            },
            path: ['Application Infrastructure Performance', hn, 'Individual Nodes', name].concat(remainder)
        }
    }
    return mapping;
}

function containerVnodes(client, app, path, range) {
    if (path.length == 1) {
        return listContainersForApp(client, app, path, range);
    } else {
        return listMetricsForContainer(client, app, path, range);
    }
}

module.exports = containerVnodes;

