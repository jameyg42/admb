const tmpl = require('../out/tmpl');

test('paren syntax', () => {
    const model = {
        who:'world'
    };
    const t = "hello %{who}!";
    expect(tmpl.evaluate(t, model)).toBe('hello world!');
})
test('bare syntax', () => {
    const model = {
        who:'world'
    };
    const t = "hello %who!";
    expect(tmpl.evaluate(t, model)).toBe('hello world!');
});
test('bare syntax with array', () => {
    const model = {
        who:['world','noone']
    };
    const t = "hello %who[0]!";
    expect(tmpl.evaluate(t, model)).toBe('hello world!');

})
