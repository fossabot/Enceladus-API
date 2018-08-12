import Router from 'koa-router';
import { thread } from '../../controller';

/**
 * router requiring _any_ authentication
 */
export const router = new Router({ prefix: '/v1' });

router.post('/thread', thread.create);
