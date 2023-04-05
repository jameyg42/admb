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


