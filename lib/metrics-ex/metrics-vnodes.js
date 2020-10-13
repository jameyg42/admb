const flatten = require('lodash').flattenDeep;
const vnode = require('./vnodes/vnode');

const vnodeHandlers = {
    "Databases": require('./vnodes/vnode-databases')
}
function vnodesFor(client, app, path, range) {
    if (path.length == 0) {
        return Promise.resolve(
            Object.keys(vnodeHandlers).map(root => vnode(root, app, path))
        );
    }
    const vnodes = flatten(
        Object.entries(vnodeHandlers)
        .filter(([k, v]) => k == path[0])
        .map(([k, v]) => v(client, app, path, range))
    );
    return Promise.all(vnodes);
}

module.exports = {
    vnodes: vnodesFor
}
