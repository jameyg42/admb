const parse = require('../out/parser').parse;


function dump(node, expr, indent) {
    console.log(`${indent}${node.name} => ${expr.substring(node.from, node.to).substring(0, 15)}`)

    if (node.firstChild) {
        dump(node.firstChild, expr, `${indent}  `);
    }
    if (node.nextSibling) {
        dump(node.nextSibling, expr, indent);
    }
}
let expr = `
// testing
9011*:/Overall*/*/Calls per Minute[value@WEEKLY] // line comments should have precendence
// search terms dont extend past newlines
|> reduce fn='avg'
|> groupBy 2 // groupBy tier 
>> [ 1492:/Overall Application Performance/Calls //per Minute //>> normalize]
`;
//x = parser.parse(expr);
//dump(x.topNode, expr, '')

expr = `
a8911*:|Business Transaction Performance|Business Transactions|phoenixportal_App|/edge/web|Average Response Time (ms)[max]
|>[b8911*:|Business Transaction Performance|Business Transactions|phoenixportal_App|/edge/web|External Calls|Call-WEB_SERVICE to Discovered backend call - GatewayService.GatewayService.https://services.ead.beneclaims.metlife.com/Middleware/Services/SOH/Ga|Average Response Time (ms)[max]>>flatten
|>[c7935*:|Application Infrastructure Performance|MB|Custom Metrics|WMB|WING01|*|GVWBSyncClaim132|Flow Statistics|MessageFlow|AverageElapsedTime]]
`;
x = parse(expr);
dump(x.topNode, expr, '')
