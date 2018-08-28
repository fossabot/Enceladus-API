import { IThread, Thread } from '../entities';
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
    .create(ctx.request.body)
    .then(created.bind(ctx))
    .catch(error.bind(ctx));
}

export async function update(ctx: BaseContext) {
  let thread = await Thread.find(ctx.params.id);

  await minimum_thread_host(ctx, thread);

  try {
    thread = await Thread.update(thread.id, ctx.request.body);
    okay.call(ctx, thread);
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function remove(ctx: BaseContext) {
  const thread = await Thread.find(ctx.params.id);

  await minimum_thread_host(ctx, thread);

  try {
    Thread.delete(thread.id);
    ctx.status = STATUS.NO_CONTENT;
  } catch (err) {
    error.call(ctx, err);
  }
}

// throws an error on ctx if the authenticated user is not the host or an admin
export async function minimum_thread_host(ctx: BaseContext, { subreddit, created_by }: IThread) {
  const user = ctx.state.user_data!;

  if (
   user.is_global_admin !== true &&
   (user as any)[`${subreddit.toLowerCase()}__is_admin`] !== true && // is local admin
   user.id !== created_by // is thread creator
  ) {
   ctx.throw(
     STATUS.UNAUTHORIZED,
     'Must be authenticated as the thread host or an admin to access this endpoint.'
   );
  }
}
