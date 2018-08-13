import Router from 'koa-router';
import { user } from '../../controller';
import { attempt_authentication } from '../../middleware/authentication';

/**
 * router with _optional_ authentication.
 * The result of the endpoint presumably depends on the auth level.
 */
export const router = new Router({ prefix: '/v1' }).use(...attempt_authentication);

router.get('/user', user.get_all);
router.get('/user/:id', user.get);
