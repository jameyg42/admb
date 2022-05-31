import express from 'express';
import cors from 'cors';
import cookies from 'cookie-parser';
import { env } from 'process';
import { asNumber } from '@metlife/appd-libutils'
import { serviceRoutes as services } from './service-routes';

const app = express();
app.use(express.static(__dirname + '/../dist/admb-ui'));
app.use(express.json())
app.use(cookies());
app.use(cors());
app.use(services);


const port = asNumber(env['ADMB_SERVER_PORT']) || 8070;
const server = app.listen(port, () => {
  console.log(`ADMB services listening on port ${port}`);
});
process.on('SIGINT', function() {
  console.log(`Received SIGINT - shutting down ADMB services on port ${port}`);
  server.close();
});
