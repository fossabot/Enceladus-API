import _get from 'lodash/get';
import User from '../entities/User';
import { BaseContext } from '../helpers/BaseContext';
import { created, error, okay } from '../helpers/method_binds';
import STATUS from '../helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  const users = await User.find_all();

  if (_get(ctx, 'state.user_data.is_global_admin') !== true) {
    users.forEach(user => delete user.refresh_token);
  }

  ctx.body = users;
  ctx.status = STATUS.OK;
}

export function get(ctx: BaseContext) {
  return User.find(ctx.query.id)
    .then(user => {
      if (_get(ctx, 'state.user_data.is_global_admin') !== true) {
        delete user.refresh_token;
      }
      return user;
    })
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export function create(ctx: BaseContext) {
  return new User(ctx.request.body)
    .save()
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
