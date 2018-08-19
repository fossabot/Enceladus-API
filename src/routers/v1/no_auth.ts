import Router from 'koa-router';
import { config } from '../../config';
import { event, preset_event, section, thread, user } from '../../controller';
import STATUS from '../../helpers/status_codes';

/**
 * router requiring _no authentication_
 */
export const router = new Router({ prefix: '/v1' });

// TODO welcome page
router.get('/', ctx => ctx.status = STATUS.NOT_IMPLEMENTED);

// there may be a use case for this in the future,
// but this should be handled entirely from within the server.
// regardless, expose for automated testing purposes
if (config.debug) {
  router.post('/user', user.create);
  router.patch('/user/:id', user.update);
  router.delete('/user/:id', user.remove);
}

router.get('/user', user.get_all);
router.get('/user/:id', user.get);

router.get('/event', event.get_all);
router.get('/event/:id', event.get);

router.get('/section', section.get_all);
router.get('/section/:id', section.get);

router.get('/preset_event', preset_event.get_all);
router.get('/preset_event/:id', preset_event.get);

router.get('/thread', thread.get_all);
router.get('/thread/:id', thread.get);
