import { getManager } from 'typeorm';
import User from '../entities/User';
import { BaseContext } from './helpers/BaseContext';
import STATUS from './helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  const user_repository = getManager().getRepository(User);
  const users = await user_repository.find();

  ctx.status = STATUS.OK;
  ctx.body = users;
}

export async function get(ctx: BaseContext) {
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

export async function create(ctx: BaseContext) {
  const user_repository = getManager().getRepository(User);
  const user_to_save = new User({ ...ctx.request.body });

  const user = await user_repository.save(user_to_save);

  if (user) {
    ctx.status = STATUS.CREATED;
    ctx.body = user;
  } else {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = '';
  }
}

export async function update(ctx: BaseContext) {
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

  // fields that can be updated
  [
    'is_global_admin',
    'spacex__is_admin',
    'spacex__is_mod',
    'spacex__is_slack_member',
  ].forEach(field => {
    if (ctx.request.body[field] !== undefined) {
      user_to_update[field] = ctx.request.body[field];
    }
  });

  const user = await user_repository.save(user_to_update);
  ctx.status = STATUS.OK;
  ctx.body = user;
}

export async function remove(ctx: BaseContext) {
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
