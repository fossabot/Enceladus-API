import Thread from '../entities/Thread';
import { BaseContext } from '../helpers/BaseContext';
import { created, error, okay } from '../helpers/method_binds';
import STATUS from '../helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  ctx.body = await Thread.find_all();
  ctx.status = STATUS.OK;
}

export function get(ctx: BaseContext) {
  return Thread
    .find(ctx.params.id)
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export function create(ctx: BaseContext) {
  return Thread
    .new(ctx.request.body)
    .then(thread => thread.save())
    .then(created.bind(ctx))
    .catch(error.bind(ctx));
}

// TODO SECURITY — need to ensure `created_by` is the same as the requesting user
// UNLESS the requesting user is a local or global admin in their relevant subreddit
export function update(ctx: BaseContext) {
  return Thread
    .find(ctx.params.id)
    .then(thread => thread.update(ctx.request.body))
    .then(thread => thread.save())
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

// TODO SECURITY — need to ensure `created_by` is the same as the requesting user
// UNLESS the requesting user is a local or global admin in their relevant subreddit
export function remove(ctx: BaseContext) {
  return Thread
    .find(ctx.params.id)
    .then(thread => thread.delete())
    .then(() => ctx.status = STATUS.NO_CONTENT)
    .catch(error.bind(ctx));
}
