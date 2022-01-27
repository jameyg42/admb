const compiler = require('../../out/lang/compiler');
test('compiler works', () => {
    const ast = compiler.compile('8911*:/Overall Application/foo/*/C{a,e}lls per Minute[baseline@WEEKLY, value] >> [ 010966*:/Overall/*/Calls] >> reduce avg >> scale factor=10');

    console.log(JSON.stringify(ast, null, '  '));
})
