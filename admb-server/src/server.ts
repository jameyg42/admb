import express, { Express } from 'express';
import cors from 'cors';
import cookies from 'cookie-parser';
import { Server } from 'http';
import { services } from './service-routes';
import { AdmbServerConfiguration } from './config';
import { defaultRegistry } from "@admb/client/out/login";

export class AdmbServer {
  private app: Express;
  private server!: Server;

  private isStartingUp = false;
  private isRunning = false;
  private runningOnPort: number = 0;

  constructor(private config:AdmbServerConfiguration) {
    if (config.controllers?.length == 0) {
      throw Error("no controllers specified in config");
    }
    if (config.loginProviders) {
      for (let method in config.loginProviders) {
        console.log(`ADMB services registering login provider for ${method}`)
        defaultRegistry.register(method, config.loginProviders[method]);
      }
    }

    const app = this.app = express();
    app.use(express.static(__dirname + '/../dist/admb-ui'));
    app.use(express.json())
    app.use(cookies());
    app.use(cors());
    app.use(services(this.config));

    process.on('SIGINT', () => {
      console.log('ADMB services received SIGINT');
      this.stop();
    });
    
  }
  start() {
    if (this.isStartingUp || this.isRunning) {
      return;
    }

    this.isStartingUp = true;
    this.runningOnPort = this.config.port || 8070;
    this.server = this.app.listen(this.runningOnPort, () => {
      this.isStartingUp = false;
      this.isRunning = true;
      console.log(`ADMB services listening on port ${this.runningOnPort}`);
    });
  }

  stop() {
    if (this.isStartingUp) {
      setTimeout(() => {
        this.stop();
      }, 1000);
    }
    if (this.isRunning) {
      this.isRunning = false;
      console.log(`ADMB services shutting down on port ${this.runningOnPort}`);
      this.server.close();
    }
  }
}
