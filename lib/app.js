const moment = require('moment');

var lastUpdated;
var appCache;

module.exports = (client) => {
    function fetchAllApps() {
        if (appCache && lastUpdated && moment.duration(moment().diff(lastUpdated)).asMinutes() <= 30) {
            return new Promise(resolve => {
                resolve(appCache);
            });
        }
        return client.get('/rest/applications?output=JSON').then(apps => {
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
 
    return {
        fetchAllApps: fetchAllApps,
        findApps: findApps,
        fetchBaselines: fetchBaselines
    }
}