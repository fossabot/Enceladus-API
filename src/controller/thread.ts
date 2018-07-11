import { getManager } from 'typeorm';
import Thread from '../entities/Thread';
import { BaseContext } from './helpers/BaseContext';
import STATUS from './helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  const thread_repository = getManager().getRepository(Thread);
  const threads = await thread_repository.find();

  ctx.status = STATUS.OK;
  ctx.body = threads;
}

export async function get(ctx: BaseContext) {
  const thread_repository = getManager().getRepository(Thread);
  const thread = await thread_repository.findOne(ctx.query.id);

  if (thread === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'Thread not found';
    return;
  }

  ctx.status = STATUS.OK;
  ctx.body = thread;
}

// TODO SECURITY — need to ensure `created_by` is the same as the requesting user
// UNLESS the requesting user is a local or global admin in their relevant subreddit
export async function create(ctx: BaseContext) {
  const thread_repository = getManager().getRepository(Thread);
  const thread_to_save = new Thread({ ...ctx.request.body });

  const thread = await thread_repository.save(thread_to_save);

  if (thread) {
    ctx.status = STATUS.CREATED;
    ctx.body = thread;
  } else {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = '';
  }
}

export async function update(ctx: BaseContext) {
  const thread_repository = getManager().getRepository(Thread);

  if (ctx.params.id === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'No id provided';
    return;
  }

  const thread_to_update = await thread_repository.findOne(ctx.params.id);

  if (thread_to_update === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'Thread not found';
    return;
  }

  // fields that can be updated
  [
    'launch_name',
    't0',
    'take_number',
    'youtube_id',
    'created_by',
    'spacex__api_id',
  ].forEach(field => {
    if (ctx.request.body[field] !== undefined) {
      thread_to_update[field] = ctx.request.body[field];
    }
  });

  const thread = await thread_repository.save(thread_to_update);
  ctx.status = STATUS.OK;
  ctx.body = thread;
}

export async function remove(ctx: BaseContext) {
  const thread_repository = getManager().getRepository(Thread);
  const thread_to_delete = await thread_repository.findOne(ctx.params.id);

  if (thread_to_delete === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'Thread not found';
    return;
  }

  await thread_repository.delete(thread_to_delete);
  ctx.status = STATUS.NO_CONTENT;
}
