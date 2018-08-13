import Router from 'koa-router';
import { preset_event, user } from '../../controller';
import { is_global_admin } from '../../middleware/authentication';

/**
 * router requiring _global admin_ authentication
 */
export const router = new Router().use(...is_global_admin);

// FIXME these only need authentication if you need the refresh token
router.get('/user', user.get_all);
router.get('/user/:id', user.get);

router.post('/user', user.create);
router.patch('/user/:id', user.update);
router.delete('/user/:id', user.remove);

router.post('/preset_event', preset_event.create);
router.patch('/preset_event/:id', preset_event.update);
router.delete('/preset_event/:id', preset_event.remove);
