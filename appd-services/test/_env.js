const { Client } = require("../out/client");

const fid = {
    uid : 'AQ813306',
    pwd : 'gad8babU'
}
const saas =  {
    url: 'https://ml-nonprod.saas.appdynamics.com/controller', 
    account: 'ml-nonprod'
};
const onprem = {
    url: 'https://qa.appd.metlife.com/controller',
    account: 'customer1'
};

saas.client = () => Client.open(saas.url, saas.account, fid.uid, fid.pwd);
onprem.client = () => Client.open(onprem.url, onprem.account, fid.uid, fid.pwd);
onprem.app = {
    id: 130,
    name:'IBSE'
};

module.exports = {
    fid, saas, onprem, defaultClient: onprem.client
}
