function vnode(name, app, path, metricId, entityType, entityId) {
    return {
        "name": name,
        "path": path,
        "app": app,
        "children" : [ ],
        "metricTreeRootType" : "VIRTUAL",
        "metricId" : metricId || 0,
        "type" : entityType || null,
        "entityId" : entityId || 0,
        "metricPath" : null,
        "iconPath" : metricId ? "/images/metricBrowser/metric_icon.svg" : "/images/metricBrowser/metric_tree_folder.svg",
        "hasChildren" : metricId ? false : true
      };
}

module.exports = vnode;