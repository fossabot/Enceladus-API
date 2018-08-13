import Router from 'koa-router';
import { event, preset_event, section, thread } from '../../controller';
import STATUS from '../../helpers/status_codes';

/**
 * router requiring _no authentication_
 */
export const router = new Router({ prefix: '/v1' });

// TODO welcome page
router.get('/', ctx => ctx.status = STATUS.NOT_IMPLEMENTED);

router.get('/event', event.get_all);
router.get('/event/:id', event.get);

router.get('/section', section.get_all);
router.get('/section/:id', section.get);

router.get('/preset_event', preset_event.get_all);
router.get('/preset_event/:id', preset_event.get);

router.get('/thread', thread.get_all);
router.get('/thread/:id', thread.get);

// FIXME authentication is needed for routes below
router.patch('/thread/:id', thread.update);
router.delete('/thread/:id', thread.remove);

[
  'event',
  'section',
].forEach(type => {
  router.post(`/${type}`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.patch(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
  router.delete(`/${type}/:id`, ctx => ctx.status = STATUS.NOT_IMPLEMENTED);
});
