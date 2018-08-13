import Router from 'koa-router';
import { thread } from '../../controller';
import { is_authenticated } from '../../middleware/authentication';

/**
 * router requiring _any_ authentication
 */
export const router = new Router({ prefix: '/v1' }).use(...is_authenticated);

router.post('/thread', thread.create);
