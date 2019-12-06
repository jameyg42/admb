module.exports = (client) => {
    const metrics = require('./metrics')(client);
    const metricsEx = require('./metricsEx')(client);

    return Object.assign(metricsEx, metrics);
    
}