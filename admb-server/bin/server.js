#! /usr/bin/env node
const Server = require('../out/package').AdmbServer;
const CONFIG_KEY = require('../out/config').ADMB_CONFIG_KEY;
require('dotenv').config();



let config = global[CONFIG_KEY] || {};
if (!config) {
   config.port  = process.env['ADMB_PORT'];
   config.controllers = eval(process.env['ADMB_CONTROLLERS'] || "[]");
   if (process.env['ADMB_SAML_PROVIDER']) {
      const SAMLProvider = require(process.env['ADMB_SAML_PROVIDER']);
      config.additionalLoginProviders = {
         'saml': new SAMLProvider()
      }
   }
}

const server = new Server(config);
server.start();