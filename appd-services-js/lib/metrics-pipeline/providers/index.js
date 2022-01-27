module.exports = () => {
    const providers = {};
    function register(name, provider) {
        console.log('registering', name, provider)
        providers[name] = provider;
    }
    
    function fetchMetrics(ctx, path) {
        return Promise.all(
            Object.values(providers).map(
                p => p.fetchMetrics(ctx, path)
            )
        )
    }
    return  {
        register: register,
        fetchMetrics: fetchMetrics
    }
}
