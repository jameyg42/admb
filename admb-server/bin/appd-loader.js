try {
  const appd = require("appdynamics");
  const config = {
    controllerHostName: 'appd-nonprod.agent.metlife.com',
    controllerPort: 443,
    controllerSslEnabled: true,
    accountName: 'ml-nonprod',
    accountAccessKey: 'z8ki043e6pk0',
    applicationName: '8133_PM_Tools_QA',
    tierName: 'admb',
    nodeName: 'ustry1metu001cl-admb-1',

    proxy: false
  };
  appd.profile(config);


  process.on('exit', (code) => {
    appd.destroy();
  });
} catch (e) {
  console.warn("AppDynamics monitoring is NOT enabled", e);
}