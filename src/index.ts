import cors from '@koa/cors';
import Koa from 'koa';
import body_parser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import 'reflect-metadata';
import { createConnection as create_connection } from 'typeorm';
import winston from 'winston';

import { config } from './config';
import { body_types } from './middleware/body_types';
import { logger } from './middleware/logging';
import { router as oauth_endpoints } from './routers/oauth';
import * as v1 from './routers/v1';
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

    app
      .use(v1.attempted_auth.routes())
      .use(v1.attempted_auth.allowedMethods())
      .use(v1.attempted_auth.middleware());

    [
      oauth_endpoints,
      v1.no_auth,
      v1.attempted_auth,
      v1.authenticated,
      v1.global_admin,
    ].forEach(router => {
      app
        .use(router.routes())
        .use(router.allowedMethods());
        // .use(router.middleware());
    });

    app.listen(config.port);
    console.log(`Server listening on port ${config.port}`);
  })
  .catch(console.log);
