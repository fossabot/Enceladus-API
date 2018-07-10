import Router from 'koa-router';
import * as controller from '../../controller';
import STATUS from '../../controller/helpers/status_codes';

/**
 * router with **no authentication required**
 */
export const router = new Router();

// TODO welcome page
router.get('/', ctx => ctx.status = STATUS.NOT_IMPLEMENTED);

// FIXME authentication is needed for many routes below

router.get('/user', controller.user.get_all_users);
router.get('/user/:id', controller.user.get_user);
router.post('/user', controller.user.create_user);
router.patch('/user/:id', controller.user.update_user);
router.delete('/user/:id', controller.user.delete_user);

[
  'event',
  'preset_event',
  'section',
  'thread',
].forEach(type => {
  router.get(`/${type}`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.get(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.post(`/${type}`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.patch(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.delete(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
});
