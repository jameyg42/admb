module.exports =  {
    "metricId" : 3094605,
    "metricName" : "METRIC DATA NOT FOUND",
    "frequency" : "ONE_MIN",
    "granularityMinutes" : 1,
    "dataTimeslices" : [ ],
    "latestTimesliceData" : -1,
    "node": {
        "name" : "Calls per Minute",
        "children" : [ ],
        "metricTreeRootType" : null,
        "metricId" : 3094605,
        "type" : "APPLICATION",
        "entityId" : 162,
        "metricPath" : null,
        "iconPath" : "/images/metricBrowser/metric_icon.svg",
        "hasChildren" : false,
        "path":["Overall Application Performance", "Calls per Minute"]
    },
    "range": require('../../../lib/range').beforeNow(60).fix(),
  } 