import Thread from '../entities/Thread';
import { BaseContext } from './helpers/BaseContext';
import STATUS from './helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  ctx.body = await Thread.find_all();
  ctx.status = STATUS.OK;
}

export async function get(ctx: BaseContext) {
  await Thread
    .find(ctx.query.id)
    .then(thread => {
      ctx.body = thread;
      ctx.status = STATUS.OK;
    }).catch(err => {
      ctx.body = err;
      ctx.status = STATUS.BAD_REQUEST;
    });
}

export async function create(ctx: BaseContext) {
  await Thread
    .new(ctx.request.body)
    .then(async thread => {
      ctx.body = await thread.save();
      ctx.status = STATUS.CREATED;
    }).catch(err => {
      ctx.body = err;
      ctx.status = STATUS.BAD_REQUEST;
    });
}

// TODO SECURITY — need to ensure `created_by` is the same as the requesting user
// UNLESS the requesting user is a local or global admin in their relevant subreddit
export async function update(ctx: BaseContext) {
  if (ctx.params.id === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'No id provided';
    return;
  }

  await Thread
    .find(ctx.params.id)
    .then(async thread => {
      ctx.body = await thread.update(ctx.request.body).save();
      ctx.status = STATUS.OK;
    }).catch(err => {
      ctx.body = err;
      ctx.status = STATUS.BAD_REQUEST;
    });
}

// TODO SECURITY — need to ensure `created_by` is the same as the requesting user
// UNLESS the requesting user is a local or global admin in their relevant subreddit
export async function remove(ctx: BaseContext) {
  await Thread
    .find(ctx.params.id)
    .then(async thread => {
      await thread.delete();
      ctx.status = STATUS.NO_CONTENT;
    }).catch(err => {
      ctx.body = err;
      ctx.status = STATUS.BAD_REQUEST;
    });
}
