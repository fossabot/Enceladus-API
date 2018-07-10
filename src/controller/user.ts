import { getManager } from 'typeorm';
import User from '../entities/User';
import { BaseContext } from './helpers/BaseContext';
import STATUS from './helpers/status_codes';

export async function get_all_users(ctx: BaseContext) {
  const user_repository = getManager().getRepository(User);
  const users = await user_repository.find();

  ctx.status = STATUS.OK;
  ctx.body = users;
}

export async function get_user(ctx: BaseContext) {
  const user_repository = getManager().getRepository(User);
  const user = await user_repository.findOne(ctx.query.id);

  if (user === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'User not found';
    return;
  }

  ctx.status = STATUS.OK;
  ctx.body = user;
}

export async function create_user(ctx: BaseContext) {
  const user_repository = getManager().getRepository(User);
  const user_to_save = new User({
    reddit_username: ctx.request.body.reddit_username,
    auth_token: ctx.request.body.auth_token,
    is_global_admin: ctx.request.body.is_global_admin === 'true',
    spacex__is_admin: ctx.request.body.spacex__is_admin === 'true',
    spacex__is_mod: ctx.request.body.spacex__is_mod === 'true',
    spacex__is_slack_member: ctx.request.body.spacex__is_slack_member === 'true',
  });

  const user = await user_repository.save(user_to_save);

  if (user) {
    ctx.status = STATUS.CREATED;
    ctx.body = user;
  } else {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = '';
  }
}

export async function update_user(ctx: BaseContext) {
  const user_repository = getManager().getRepository(User);

  if (ctx.params.id === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'No id provided';
    return;
  }

  const user_to_update = await user_repository.findOne(ctx.params.id);

  if (user_to_update === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'User not found';
    return;
  }

  // boolean fields that can be updated
  [
    'is_global_admin',
    'spacex__is_admin',
    'spacex__is_mod',
    'spacex__is_slack_member',
  ].forEach(field => {
    if (ctx.request.body[field] !== undefined) {
      user_to_update[field] = ctx.request.body[field] === 'true';
    }
  });

  const user = await user_repository.save(user_to_update);
  ctx.status = STATUS.OK;
  ctx.body = user;
}

export async function delete_user(ctx: BaseContext) {
  const user_repository = getManager().getRepository(User);
  const user_to_delete = await user_repository.findOne(ctx.params.id);

  if (user_to_delete === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'User not found';
    return;
  }

  await user_repository.delete(user_to_delete);
  ctx.status = STATUS.NO_CONTENT;
}
