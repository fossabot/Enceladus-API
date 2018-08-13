import cors from '@koa/cors';
import Koa from 'koa';
import body_parser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import 'reflect-metadata';
import { createConnection as create_connection } from 'typeorm';
import winston from 'winston';

import { config } from './config';
import { body_types } from './middleware/body_types';
import { logger } from './middleware/logging';
import { router as oauth_endpoints } from './routers/oauth';
import v1 from './routers/v1';
// import { sockets } from './sockets';

import './reddit';

create_connection({
  type: 'postgres',
  ...config.db,
  synchronize: true,
  logging: false,
  entities: ['dist/entities/**/*.js'],
})
  .then(async _connection => {
    const app = new Koa();

    // sockets.event.attach(app);
    // sockets.preset_event.attach(app);
    // sockets.section.attach(app);
    // sockets.thread.attach(app);
    // sockets.user.attach(app);

    app.use(helmet());
    app.use(cors());
    app.use(logger(winston));
    app.use(body_parser());
    app.use(body_types);

    routes_for(app, oauth_endpoints, v1);

    app.listen(config.port);
    console.log(`Server listening on port ${config.port}`);
  })
  .catch(console.log);

function routes_for(app: Koa, ...routers: Router[]) {
  routers.forEach(router => {
    app
      .use(router.routes())
      .use(router.allowedMethods())
      .use(router.middleware());
  });
}
