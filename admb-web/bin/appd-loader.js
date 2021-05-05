const appd = require("appdynamics");
const config = {
  controllerHostName: 'qa.appd.metlife.com',
  controllerPort: 443,
  controllerSslEnabled: true,
  accountName: 'customer1',
  accountAccessKey: '9c94ee08-a3fb-403a-b726-183888f93515',
  applicationName: '8133-Production Management Tools_QA',
  tierName: 'admb',
  nodeName: 'ustry1metu001cl-admb-1',

  proxy: false
};
appd.profile(config);


process.on('exit', (code) => {
	appd.destroy();
});
