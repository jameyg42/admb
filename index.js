module.exports = (client) => {
    return {
        app: require('./lib/app')(client),
        metrics: require('./lib/metrics')(client),
        range: require('./lib/range')
    }
}