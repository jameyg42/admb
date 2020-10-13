const vnode = require('./vnodes/vnode');

const vnodeHandlers = {
    'Databases': require('./vnodes/vnode-databases'),
    'Servers'  : require('./vnodes/vnode-servers')
}
function vnodesFor(client, app, path, range) {
    if (path.length == 0) {
        return Promise.resolve(
            Object.keys(vnodeHandlers).map(root => vnode(root, app, path))
        );
    }
    const vnodes =  Object
        .entries(vnodeHandlers)
        .filter(([k, f]) => k == path[0])
        .map(([k, f]) => f(client, app, path, range))
    ;
    return Promise.all(vnodes);
}

module.exports = {
    vnodes: vnodesFor
}
