import jwt from 'koa-jwt';
import pick from 'lodash/pick';
import { getManager } from 'typeorm';
import { config } from '../config';
import User from '../entities/User';
import { BaseContext } from '../helpers/BaseContext';
import STATUS from '../helpers/status_codes';

const authenticated = jwt({ secret: config.jwt_secret });

async function assign_user_data(ctx: BaseContext, next: () => Promise<unknown>) {
  const reddit_username = ctx.state.user!.user;

  // we can safely tell the compiler that this is _not_ undefined,
  // as the token would not have been issued if the user didn't exist
  const user = (await getManager()
    .getRepository(User)
    .findOne({ reddit_username }))!;

  ctx.state.user_data = pick(user, [
    'is_global_admin',
    'spacex__is_admin',
    'spacex__is_mod',
    'spacex__is_slack_member',
  ]);

  await next();
}

async function global_admin(ctx: BaseContext, next: () => Promise<unknown>) {
  if (ctx.state.user_data!.is_global_admin !== true) {
    ctx.throw(
      STATUS.UNAUTHORIZED,
      'Must be authenticated as a global admin to access this endpoint.',
    );
  }

  await next();
}

export const is_authenticated = [authenticated, assign_user_data];
export const is_global_admin = [authenticated, assign_user_data, global_admin];
