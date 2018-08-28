import jwt from 'koa-jwt';
import get from 'lodash/get';
import { config } from '../config';
import User from '../entities/User';
import { BaseContext } from '../helpers/BaseContext';
import STATUS from '../helpers/status_codes';

const authenticated = jwt({ secret: config.jwt_secret, key: 'jwt' });

async function assign_data(ctx: BaseContext, next: () => Promise<unknown>) {
  const user_id: Option<number> = get(ctx, 'state.jwt.user_id');

  // does not have a valid JWT
  if (user_id === undefined) {
    return next();
  }

  ctx.state.user_data = await User.find(user_id);

  return next();
}

function global_admin(ctx: BaseContext, next: () => Promise<unknown>) {
  // if (get(ctx, 'state.user_data.is_global_admin') !== true) {
  if (ctx.state.user_data!.is_global_admin !== true) {
    ctx.throw(
      STATUS.UNAUTHORIZED,
      'Must be authenticated as a global admin to access this endpoint.',
    );
  }

  return next();
}

export const is_authenticated = [authenticated, assign_data];
export const is_global_admin = [authenticated, assign_data, global_admin];
