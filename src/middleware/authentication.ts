import jwt from 'koa-jwt';
import get from 'lodash/get';
import pick from 'lodash/pick';
import { getManager } from 'typeorm';
import { config } from '../config';
import User from '../entities/User';
import { BaseContext } from '../helpers/BaseContext';
import STATUS from '../helpers/status_codes';

const authenticated = jwt({ secret: config.jwt_secret, key: 'jwt' });
const auth_passthrough = jwt({ secret: config.jwt_secret, key: 'jwt', passthrough: true });

async function assign_data(ctx: BaseContext, next: () => Promise<unknown>) {
  const reddit_username: Option<string> = get(ctx, 'state.jwt.user');

  // does not have a valid JWT
  if (reddit_username === undefined) {
    return next();
  }

  const user = await getManager()
    .getRepository(User)
    .findOne({ reddit_username });

  // user listed in JWT does not exist
  if (user === undefined) {
    return next();
  }

  ctx.state.user_data = pick(user, [
    'is_global_admin',
    'spacex__is_admin',
    'spacex__is_mod',
    'spacex__is_slack_member',
  ]);

  return next();
}

function global_admin(ctx: BaseContext, next: () => Promise<unknown>) {
  if (get(ctx, 'state.user_data.is_global_admin') !== true) {
    ctx.throw(
      STATUS.UNAUTHORIZED,
      'Must be authenticated as a global admin to access this endpoint.',
    );
  }

  return next();
}

export const attempt_authentication = [auth_passthrough, assign_data];
export const is_authenticated = [authenticated, assign_data];
export const is_global_admin = [authenticated, assign_data, global_admin];
