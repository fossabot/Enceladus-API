import once from 'lodash/once';
import Thread from '../entities/Thread';
import { BaseContext } from './helpers/BaseContext';
import { created, error, okay } from './helpers/method_binds';
import STATUS from './helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  ctx.body = await Thread.find_all();
  ctx.status = STATUS.OK;
}

export async function get(ctx: BaseContext) {
  await Thread
    .find(ctx.query.id)
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export async function create(ctx: BaseContext) {
  await Thread
    .new(ctx.request.body)
    .then(thread => thread.save())
    .then(created.bind(ctx))
    .catch(error.bind(ctx));
}

// TODO SECURITY — need to ensure `created_by` is the same as the requesting user
// UNLESS the requesting user is a local or global admin in their relevant subreddit
export async function update(ctx: BaseContext) {
  await Thread
    .find(ctx.params.id)
    .then(thread => thread.update(ctx.request.body))
    .then(thread => thread.save())
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

// TODO SECURITY — need to ensure `created_by` is the same as the requesting user
// UNLESS the requesting user is a local or global admin in their relevant subreddit
export async function remove(ctx: BaseContext) {
  await Thread
    .find(ctx.params.id)
    .then(thread => thread.delete())
    .then(once(() => ctx.status = STATUS.NO_CONTENT))
    .catch(error.bind(ctx));
}
