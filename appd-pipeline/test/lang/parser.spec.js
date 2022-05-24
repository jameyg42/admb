const parse = require('../../out/lang/parser').parse;
const utils = require('./_parser-test-utils');

test('pipeline test util works', () => {
    const nodes = utils
        .pipeline("8911:/Overall/Calls[value@WEEKLY] >> reduce 10 key=val")
        .search('8911', '/Overall/Calls', 'value', 'WEEKLY')
        .command('reduce', ['10', {key:'val'}])
        .nodes();
    expect(nodes).toStrictEqual([
        {Pipeline:'8911:/Overall/Calls[value@WEEKLY] >> reduce 10 key=val'},
        {SearchCommandExpression: '8911:/Overall/Calls[value@WEEKLY]'},
        {Application:'8911'},
        {Path: '/Overall/Calls'},
        {PathSegment: 'Overall'},
        {PathSegment: 'Calls'},
        {ValueType: 'value'},
        {Baseline: 'WEEKLY'},
        {Command: 'reduce'},
        {Arg: '10'},
        {Value: '10'},
        {Arg: 'key=val'},
        {Name: 'key'},
        {Value: 'val'}
    ]);
});

test.only('search only', () => {
    const n = utils.dump_to_array("app:/Overall/Calls");
console.log(n);
    expect(n).toStrictEqual(utils
        .pipeline('app:/Overall/Calls')
        .search('app', '/Overall/Calls')
        .nodes()
    );
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
