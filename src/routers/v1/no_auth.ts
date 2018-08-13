import Router from 'koa-router';
import { preset_event, thread, user } from '../../controller';
import STATUS from '../../helpers/status_codes';

/**
 * router requiring _no authentication_
 */
export const router = new Router();

// TODO welcome page
router.get('/', ctx => ctx.status = STATUS.NOT_IMPLEMENTED);

// FIXME authentication is needed for some routes below

router.get('/user', user.get_all);
router.get('/user/:id', user.get);

router.get('/preset_event', preset_event.get_all);
router.get('/preset_event/:id', preset_event.get);

router.get('/thread', thread.get_all);
router.get('/thread/:id', thread.get);
router.patch('/thread/:id', thread.update);
router.delete('/thread/:id', thread.remove);

[
  'event',
  'section',
].forEach(type => {
  router.get(`/${type}`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.get(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.post(`/${type}`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.patch(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.delete(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
});
