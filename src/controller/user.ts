import User from '../entities/User';
import { BaseContext } from './helpers/BaseContext';
import STATUS from './helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  ctx.body = await User.find_all();
  ctx.status = STATUS.OK;
}

export async function get(ctx: BaseContext) {
  const user = await User.find(ctx.query.id);

  if (user === undefined) {
    ctx.body = 'User not found';
    ctx.status = STATUS.BAD_REQUEST;
    return;
  }

  ctx.body = user;
  ctx.status = STATUS.OK;
}

export async function create(ctx: BaseContext) {
  const user = new User(ctx.request.body);

  if (user) {
    ctx.body = await user.save();
    ctx.status = STATUS.CREATED;
  } else {
    ctx.body = '';
    ctx.status = STATUS.BAD_REQUEST;
  }
}

export async function update(ctx: BaseContext) {
  if (ctx.params.id === undefined) {
    ctx.body = 'No id provided';
    ctx.status = STATUS.BAD_REQUEST;
    return;
  }

  const user = await User.find(ctx.params.id);

  if (user === undefined) {
    ctx.body = 'User not found';
    ctx.status = STATUS.BAD_REQUEST;
    return;
  }

  ctx.body = await user.update(ctx.request.body).save();
  ctx.status = STATUS.OK;
}

export async function remove(ctx: BaseContext) {
  const user = await User.find(ctx.params.id);

  if (user === undefined) {
    ctx.body = 'User not found';
    ctx.status = STATUS.BAD_REQUEST;
    return;
  }

  await user.delete();
  ctx.status = STATUS.NO_CONTENT;
}
