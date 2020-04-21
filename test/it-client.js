const client = require('@metlife/appd-client-js')

module.exports = client.open({
    url: 'https://qa.appd.metlife.com',
    uid : 'AQ813306',
    pwd : 'gad8babU'
})
