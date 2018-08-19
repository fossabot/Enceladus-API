import _get from 'lodash/get';
import User from '../entities/User';
import { BaseContext } from '../helpers/BaseContext';
import { created, error, okay } from '../helpers/method_binds';
import STATUS from '../helpers/status_codes';
import { sign } from '../routers/oauth';

export async function get_all(ctx: BaseContext) {
  ctx.body = await User.find_all();
  ctx.status = STATUS.OK;
}

export function get(ctx: BaseContext) {
  return User.find(ctx.params.id)
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export function create(ctx: BaseContext) {
  return new User(ctx.request.body)
    .save()
    .then(user => ({ ...user, jwt: sign(user.reddit_username) }))
    .then(created.bind(ctx))
    .catch(error.bind(ctx));
}

export function update(ctx: BaseContext) {
  return User.find(ctx.params.id)
    .then(user => user.update(ctx.request.body))
    .then(user => user.save())
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export function remove(ctx: BaseContext) {
  return User.find(ctx.params.id)
    .then(user => user.delete())
    .then(() => ctx.status = STATUS.NO_CONTENT)
    .catch(error.bind(ctx));
}
