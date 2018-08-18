import Router from 'koa-router';
import { config } from '../../config';
import { preset_event, user } from '../../controller';
import { is_global_admin } from '../../middleware/authentication';

/**
 * router requiring _global admin_ authentication
 */
export const router = new Router({ prefix: '/v1' }).use(...is_global_admin);

// there may be a use case for this in the future,
// but this should be handled entirely from within the server.
// regardless, expose for automated testing purposes
if (config.debug) {
  router.post('/user', user.create);
  router.patch('/user/:id', user.update);
  router.delete('/user/:id', user.remove);
}

router.post('/preset_event', preset_event.create);
router.patch('/preset_event/:id', preset_event.update);
router.delete('/preset_event/:id', preset_event.remove);
