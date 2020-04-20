const _ = require('lodash');
const moment = require('moment');

const TYPEMAP = {
    'apmApplications': 'APM',
    'eumWebApplications': 'EUM',
    'dbMonApplication' : 'SYSTEM',
    'simApplication' : 'SYSTEM',
    'analyticsApplication' : 'SYSTEM'
}

module.exports = (client) => {
    var lastUpdated;
    var appCache;

    function fetchAllApps() {
        if (appCache && lastUpdated && moment.duration(moment().diff(lastUpdated)).asMinutes() <= 30) {
            return new Promise(resolve => {
                resolve(appCache);
            });
        }
        return client.get('/restui/applicationManagerUiBean/getApplicationsAllTypes')
        .then(all => {
            let apps = Object.keys(all)
                .filter(t => all[t] !== null)
                .map(t => (_.isArray(all[t]) ? all[t] : [all[t]]).map(a => ({
                    id: a.id,
                    name: a.name,
                    type: TYPEMAP[t] || 'UNKNOWN'
                }))
            );
            apps = _.flatten(apps);
            lastUpdated = moment();
            appCache = apps;
            return apps;
        })
    }
    function findApps(regex) {
        return fetchAllApps(client).then(apps => {
            return apps.filter(a => regex.test(a));
        })
    }
    function fetchBaselines(app) {
        return client.get(`/restui/baselines/getAllBaselines/${app.id}`);
    }

    const FIND_DEFAULT = (bl) => bl.defaultBaseline;
    const FIND_SEASONAL = (s) => (bl) => bl.seasonality === s;
    const FIND_NAMED = (n) => (bl) => bl.name === n;
    const findMap = {
        'DEFAULT' : FIND_DEFAULT,
        'DAILY' : FIND_SEASONAL('DAILY'),
        'WEEKLY' : FIND_SEASONAL('WEEKLY'),
        'MONTHLY' : FIND_SEASONAL('MONTHLY'),
    }
    function findBaseline(app, bl) {
        const finder = findMap[bl] || FIND_NAMED(bl);
        return fetchBaselines(app)
            .then(bls => bls.filter(finder).shift());
    }
 
    return {
        fetchAllApps: fetchAllApps,
        findApps: findApps,
        fetchBaselines: fetchBaselines,
        findBaseline: findBaseline
    }
}