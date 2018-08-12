import cors from '@koa/cors';
import Koa from 'koa';
import body_parser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import Router from 'koa-router';
import 'reflect-metadata';
import { createConnection as create_connection } from 'typeorm';
import winston from 'winston';

import { config } from './config';
import { assign_user_data, is_global_admin } from './middleware/authentication';
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
}).then(async _connection => {
  const app = new Koa();

  // not really necessary, but allows for more self-documenting code
  const minimum_authentication = app.use.bind(app);
  const middleware = app.use.bind(app);

  // sockets.event.attach(app);
  // sockets.preset_event.attach(app);
  // sockets.section.attach(app);
  // sockets.thread.attach(app);
  // sockets.user.attach(app);

  middleware(helmet());
  middleware(cors());
  middleware(logger(winston));
  middleware(body_parser());
  middleware(body_types);

  routes_for(app, v1.no_auth, oauth_endpoints);

  // required: any authentication
  middleware(jwt({ secret: config.jwt_secret }));
  middleware(assign_user_data);
  routes_for(app, v1.authenticated);

  // required: global admin
  minimum_authentication(is_global_admin);
  routes_for(app, v1.global_admin);

  app.listen(config.port);
  console.log(`Server listening on port ${config.port}`);

}).catch(console.log);

function routes_for(app: Koa, ...routers: Router[]) {
  routers.forEach(router => app.use(router.routes()).use(router.allowedMethods()));
}
