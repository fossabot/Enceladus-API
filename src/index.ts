import cors from '@koa/cors';
import Koa from 'koa';
import body_parser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import 'reflect-metadata';
import { createConnection as create_connection } from 'typeorm';
import winston from 'winston';

import { config } from './config';
import { body_types } from './middleware/body_types';
import { logger } from './middleware/logging';
import { router as jwt_endpoint } from './routers/jwt';
import * as v1 from './routers/v1';
// import { sockets } from './sockets';

create_connection({
  type: 'postgres',
  ...config.db,
  synchronize: true,
  logging: false,
  entities: ['dist/entities/**/*.js'],
}).then(async _connection => {
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

  app.use(v1.no_auth.routes()).use(v1.no_auth.allowedMethods());

  // require valid JWT to continue
  app.use(jwt({ secret: config.jwt_secret }));
  app.use(jwt_endpoint.routes()).use(jwt_endpoint.allowedMethods());

  app.listen(config.port);
  console.log(`Server listening on port ${config.port}`);

}).catch(console.log);
