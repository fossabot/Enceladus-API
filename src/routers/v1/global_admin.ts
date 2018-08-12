import Router from 'koa-router';
import { preset_event, user } from '../../controller';

/**
 * router requiring _global admin_ authentication
 */
export const router = new Router({ prefix: '/v1' });

router.post('/user', user.create);
router.patch('/user/:id', user.update);
router.delete('/user/:id', user.remove);

router.post('/preset_event', preset_event.create);
router.patch('/preset_event/:id', preset_event.update);
router.delete('/preset_event/:id', preset_event.remove);
