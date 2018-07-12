import User from '../entities/User';
import { BaseContext } from './helpers/BaseContext';
import STATUS from './helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  ctx.body = await User.find_all();
  ctx.status = STATUS.OK;
}

export async function get(ctx: BaseContext) {
  await User
  .find(ctx.query.id)
  .then(user => {
    ctx.body = user;
    ctx.status = STATUS.OK;
  }).catch(err => {
    ctx.body = err;
    ctx.status = STATUS.BAD_REQUEST;
  });
}

export async function create(ctx: BaseContext) {
  await new User(ctx.request.body)
  .save()
  .then(user => {
    ctx.body = user;
    ctx.status = STATUS.CREATED;
  }).catch(err => {
    ctx.body = err;
    ctx.status = STATUS.BAD_REQUEST;
  });
}

export async function update(ctx: BaseContext) {
  await User
  .find(ctx.params.id)
  .then(user => user.update(ctx.request.body))
  .then(user => user.save())
  .then(user => {
    ctx.body = user;
    ctx.status = STATUS.OK;
  })
  .catch(err => {
    ctx.body = err;
    ctx.status = STATUS.BAD_REQUEST;
  });
}

export async function remove(ctx: BaseContext) {
  await User
  .find(ctx.params.id)
  .then(user => user.delete())
  .then(() => ctx.status = STATUS.NO_CONTENT)
  .catch(err => {
    ctx.body = err;
    ctx.status = STATUS.BAD_REQUEST;
  });
}
