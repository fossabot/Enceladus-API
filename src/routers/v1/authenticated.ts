import Router from 'koa-router';
import { event, section, thread } from '../../controller';
import { is_authenticated } from '../../middleware/authentication';

/**
 * router requiring _any_ authentication
 */
export const router = new Router({ prefix: '/v1' }).use(...is_authenticated);

router.post('/thread', thread.create);
router.patch('/thread/:id', thread.update);
router.delete('/thread/:id', thread.remove);

router.post('/section', section.create);
router.patch('/section/:id', section.update);
router.delete('/section/:id', section.remove);

router.post('/event', event.create);
router.patch('/event/:id', event.update);
router.delete('/event/:id', event.remove);
