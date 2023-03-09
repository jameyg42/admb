import { Client } from "@metlife/appd-client";
import { Range, defaultRange } from "../range";

import { MetricsServices, Path, MetricNode, PathArg } from "../metrics";

import { DatabaseVnodeProvider } from "./providers/databases";
import { ServersVnodeProvider } from "./providers/servers";
import { ContainerVnodeProvider } from "./providers/containers";
import { flattenDeep } from "lodash";
import { App } from "../app";

export interface VNodeMapping {
    app: App;
    mappedTo: Path;
}
export interface VNodeProvider {
    name: string;
    resolveVirtualNodes(client:Client, app:App, path:Path, range:Range): Promise<(MetricNode|VNodeMapping)[]>
}

export function createMapping(app: App, mappedTo:Path):VNodeMapping {
     return {app, mappedTo} as VNodeMapping;
}
export function createVNode(name:string, app:App, path:Path, metricId = 0, entityType:string|null = null, entityId = 0):MetricNode {
    return {
        "name": name,
        "path": path,
        "app": app,
        "metricTreeRootType" : null,
        "metricId" : metricId,
        "type" : entityType,
        "entityId" : entityId,
        "metricPath" : null,
        "iconPath" : metricId ? "/images/metricBrowser/metric_icon.svg" : "/images/metricBrowser/metric_tree_folder.svg",
        "hasChildren" : metricId ? false : true,
        "children": []
      };
}

const providers = [
    new ServersVnodeProvider(),
    new DatabaseVnodeProvider(),
    new ContainerVnodeProvider()
];

export class VNodeServices {
    private metrics: MetricsServices;
    constructor(private client:Client) {
        this.metrics = new MetricsServices(client);
    }
    static create(client:Client|Promise<Client>):Promise<VNodeServices> {
        return client instanceof Client
            ? Promise.resolve(new VNodeServices(client))
            : client.then(c => new VNodeServices(c));
    }
    browseTree(app:App, pathArg:PathArg, range:Range = defaultRange):Promise<MetricNode[]> {
        const metrics = this.metrics || this;
        const path:Path = Array.isArray(pathArg) ? pathArg : pathArg.split('|');
        if (path.length == 0) { // root nodes
            return Promise.resolve(providers.map(p => createVNode(p.name, app, [])));
        }
        else {
            return Promise.all(
                providers
                .filter(p => p.name == path[0])
                .map(p => p.resolveVirtualNodes(this.client, app, path, range))
            )
            .then(flattenDeep)
            .then(vnodes => 
                Promise.all( // resolve any Mappings to the MetricNode
                vnodes.map(vn => {
                    if ((vn as VNodeMapping).mappedTo) {
                        return metrics.browseTree((vn as VNodeMapping).app, (vn as VNodeMapping).mappedTo, range)
                        .then(ns => ns.map(n => {
                            n.path = path.concat(n.path.slice(-1));
                            return n;
                        }))
                    } else {
                        return Promise.resolve([vn] as MetricNode[]);
                    }
                }))
            )
            .then(flattenDeep);
        }
    }

    /**
     * add VNode capabilities to the provided MetricsService
     * @param metrics
     * @param vnodes 
     */
    static extend(metrics:MetricsServices) {
        // semi-hack - vbt.apply() allows metrics.client to be used
        // w/out having to make it public
        const mbt = metrics.browseTree;
        const vbt = VNodeServices.prototype.browseTree;
        metrics.browseTree = (app:App, path:PathArg, range:Range = defaultRange) => {
            return Promise.all([
                mbt.apply(metrics, [app, path, range]),
                vbt.apply(metrics, [app, path, range])
            ])
            .then(flattenDeep);
        }
    }
}
