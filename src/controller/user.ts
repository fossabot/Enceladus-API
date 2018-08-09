import once from 'lodash/once';
import User from '../entities/User';
import { BaseContext } from './helpers/BaseContext';
import { created, error, okay } from './helpers/method_binds';
import STATUS from './helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  ctx.body = await User.find_all();
  ctx.status = STATUS.OK;
}

export async function get(ctx: BaseContext) {
  await User
    .find(ctx.query.id)
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export async function create(ctx: BaseContext) {
  await new User(ctx.request.body)
    .save()
    .then(created.bind(ctx))
    .catch(error.bind(ctx));
}

export async function update(ctx: BaseContext) {
  await User
    .find(ctx.params.id)
    .then(user => user.update(ctx.request.body))
    .then(user => user.save())
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export async function remove(ctx: BaseContext) {
  await User
    .find(ctx.params.id)
    .then(user => user.delete())
    .then(once(() => ctx.status = STATUS.NO_CONTENT))
    .catch(error.bind(ctx));
}
