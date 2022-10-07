import { App, Baseline, Season } from './types';
import { Client } from "../client";
import { flatten } from 'lodash';
import { ReadThroughCache } from '@metlife/appd-libutils/out/cache';
import { matches } from '@metlife/appd-libutils/out/glob';
import { Duration } from '@metlife/appd-libutils/out/time';

const cache = new ReadThroughCache();

export class AppServices {
    constructor(private client:Client) { }

    static create(client:Client|Promise<Client>):Promise<AppServices> {
        return client instanceof Client
            ? Promise.resolve(new AppServices(client))
            : client.then(c => new AppServices(c));
    }

    fetchAllApps():Promise<App[]> {
        return cache.get(`apps-${this.client.session.url}`, () => {
            return this.client.get<any>('/restui/applicationManagerUiBean/getApplicationsAllTypes')
            .then(all => {
                let apps = Object.keys(all)
                    .filter(t => all[t] !== null)
                    .map(t => (Array.isArray(all[t]) ? all[t] : [all[t]]).map((a:any) => ({
                        id: a.id,
                        name: a.name,
                        type: TYPEMAP[t] || 'UNKNOWN'
                    } as App))
                ) as App[];
                apps = flatten(apps);
                return apps;
            })
        }, Duration.fromObject({minutes:10}));
    }
    findApps(pattern:RegExp|string):Promise<App[]> {
        return this.fetchAllApps().then(apps => {
            return apps.filter((a:any) => pattern instanceof RegExp ? pattern.test(a.name) : matches(pattern, a.name));
        })
    }
    fetchBaselines(app:App):Promise<Baseline[]> {
        return this.client.get<Baseline[]>(`/restui/baselines/getAllBaselines/${app.id}`)
    }

    findBaseline(app:App, bl:string):Promise<Baseline|undefined> {
        const finder = findMap[bl] || FIND_NAMED(bl);
        return this.fetchBaselines(app)
            .then(bls => bls.find(finder))
            .then(b => {
                // FIXME if we use a mapped name to lookup a baseline, appd-pipeline 
                // expects the baseline name to be the mapped name.  We'll look for a
                // better solution in the future
                if (b && findMap[bl]) {
                    b.name = bl;
                }
                return b;
            });
    }
}

const TYPEMAP = {
    'apmApplications': 'APM',
    'eumWebApplications': 'EUM',
    'dbMonApplication' : 'SYSTEM',
    'simApplication' : 'SYSTEM',
    'analyticsApplication' : 'SYSTEM'
} as any;

const FIND_DEFAULT = (bl:any) => bl.defaultBaseline;
const FIND_SEASONAL = (s:Season) => (bl:any) => bl.seasonality === s;
const FIND_NAMED = (n:string) => (bl:any) => matches(n, bl.name);
const findMap = {
    'DEFAULT' : FIND_DEFAULT,
    'DAILY' : FIND_SEASONAL('DAILY'),
    'WEEKLY' : FIND_SEASONAL('WEEKLY'),
    'MONTHLY' : FIND_SEASONAL('MONTHLY'),
} as any;
