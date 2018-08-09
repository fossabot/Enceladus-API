import Router from 'koa-router';
import STATUS from '../controller/helpers/status_codes';

export const router = new Router();

router.get('/get_jwt', ctx => {
  ctx.body = ctx.state.user;
  ctx.status = STATUS.OK;
});
