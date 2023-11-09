import express from 'express';
import cookies from 'cookie-parser';
import { env } from 'process';
import { asNumber } from '@metlife/appd-libutils'

import { serviceRoutes as login } from './controllers/login';
import { serviceRoutes as pipeline } from './controllers/pipeline';
import { serviceRoutes as user } from './controllers/user';
import { authenticationMiddleware } from './authentication';

const app = express();
app.use(express.static(__dirname + '/../dist/admb-ui'));
app.use(express.json())
app.use(cookies());
app.use("/api", login);
app.use(authenticationMiddleware);
app.use("/api", pipeline);
app.use("/api", user);


const port = asNumber(env['ADMB_SERVER_PORT']) || 8070;
const server = app.listen(port, () => {
  console.log(`ADMB services listening on port ${port}`);
});
process.on('SIGINT', function() {
  console.log(`Received SIGINT - shutting down ADMB services on port ${port}`);
  server.close();
});
