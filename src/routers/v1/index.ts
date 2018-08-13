import Router from 'koa-router';

import { router as authenticated } from './authenticated';
import { router as global_admin } from './global_admin';
import { router as no_auth } from './no_auth';

export default new Router({ prefix: '/v1' })
  .use(no_auth.routes()).use(no_auth.middleware()).use(no_auth.allowedMethods())
  .use(authenticated.routes()).use(authenticated.middleware()).use(authenticated.allowedMethods())
  .use(global_admin.routes()).use(global_admin.middleware()).use(global_admin.allowedMethods());
