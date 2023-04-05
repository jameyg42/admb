const http = require('../../out/http');

test('unhandled error rejects', async () => {
    const client = new http.HttpClient();
    expect(client.get('https://localhost:123456')).rejects.toThrow();
})
test('chained catch works', async () => {
    const client = new http.HttpClient();
    client.onError(e => console.log('caught error via subscription'));
    client.get('https://localhost:123456').catch(e => console.log('caught error via catch'));
});
