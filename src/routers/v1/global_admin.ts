import Router from 'koa-router';
import { preset_event, user } from '../../controller';
import { is_global_admin } from '../../middleware/authentication';

/**
 * router requiring _global admin_ authentication
 */
export const router = new Router({ prefix: '/v1' }).use(...is_global_admin);

router.post('/user', user.create);
router.patch('/user/:id', user.update);
router.delete('/user/:id', user.remove);

router.post('/preset_event', preset_event.create);
router.patch('/preset_event/:id', preset_event.update);
router.delete('/preset_event/:id', preset_event.remove);
