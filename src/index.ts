import cors from '@koa/cors';
import Koa from 'koa';
import body_parser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import 'reflect-metadata';
import winston from 'winston';

import { config } from './config';
import { create_tables, knex } from './create_tables';
import { body_types } from './middleware/body_types';
import { logger } from './middleware/logging';
import { router as oauth_endpoints } from './routers/oauth';
import * as v1 from './routers/v1';
// import { sockets } from './sockets';

import './reddit';

export { knex };

create_tables()
  .then(async () => {
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

    [oauth_endpoints, v1.no_auth, v1.authenticated, v1.global_admin].forEach(
      router => {
        app
          .use(router.routes())
          .use(router.allowedMethods())
          .use(router.middleware());
      },
    );

    app.listen(config.port);
    console.log(`Server listening on port ${config.port}`);
  })
  .catch(console.log);
