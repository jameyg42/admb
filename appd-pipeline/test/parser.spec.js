const parse = require('../out/parser').parse;

function dump_to_array(expr) {
    const tree = parse(expr);
    const nodes = [];
    tree.iterate({
        enter: (type, from, to, get) => {
            node  = get();
            nodes.push({
                name: node.name,
                value: expr.substring(node.from, node.to)
            });
            return true;
        }
    });
    return nodes;
}

test('search expression only', () => {
    const n = dump_to_array("app:/Overall/Calls");
    expect(n[0].name).toBe('Pipeline');
    expect(n[1].name).toBe('SearchExpression');
    expect(n[2].name).toBe('AppExpression');
    expect(n[2].value).toBe('app')
    expect(n[3].value).toBe('/Overall/Calls');
});

// let expr = `
// // testing
// 9011*:/Overall*/*/Calls per Minute[value@WEEKLY] // line comments should have precendence
// // search terms dont extend past newlines
// |> reduce fn='avg'
// |> groupBy 2 // groupBy tier 
// >> [ 1492:/Overall Application Performance/Calls //per Minute //>> normalize]
// `;

// //x = parser.parse(expr);
// //dump(x.topNode, expr, '')

// expr = `
// a8911*:|Business Transaction Performance|Business Transactions|phoenixportal_App|/edge/web|Average Response Time (ms)[max]
// |>[b8911*:|Business Transaction Performance|Business Transactions|phoenixportal_App|/edge/web|External Calls|Call-WEB_SERVICE to Discovered backend call - GatewayService.GatewayService.https://services.ead.beneclaims.metlife.com/Middleware/Services/SOH/Ga|Average Response Time (ms)[max]>>flatten
// |>[c7935*:|Application Infrastructure Performance|MB|Custom Metrics|WMB|WING01|*|GVWBSyncClaim132|Flow Statistics|MessageFlow|AverageElapsedTime]]
// `;
// x = parse(expr);
// dump(x, expr);
