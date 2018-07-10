import Router from 'koa-router';
import {
  preset_event,
  user,
} from '../../controller';
import STATUS from '../../controller/helpers/status_codes';

/**
 * router with **no authentication required**
 */
export const router = new Router();

// TODO welcome page
router.get('/', ctx => ctx.status = STATUS.NOT_IMPLEMENTED);

// FIXME authentication is needed for many routes below

router.get('/user', user.get_all);
router.get('/user/:id', user.get);
router.post('/user', user.create);
router.patch('/user/:id', user.update);
router.delete('/user/:id', user.remove);

router.get('/preset_event', preset_event.get_all);
router.get('/preset_event/:id', preset_event.get);
router.post('/preset_event', preset_event.create);
router.patch('/preset_event/:id', preset_event.update);
router.delete('/preset_event/:id', preset_event.remove);

[
  'event',
  'section',
  'thread',
].forEach(type => {
  router.get(`/${type}`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.get(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.post(`/${type}`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.patch(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.delete(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
});
