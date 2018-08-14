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

export async function update(ctx: BaseContext) {
  const thread = await Thread.find(ctx.params.id, { user: true });

  await minimum_thread_host(ctx, thread);

  try {
    thread.update(ctx.request.body);
    thread.save();
    okay.call(ctx, thread);
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function remove(ctx: BaseContext) {
  const thread = await Thread.find(ctx.params.id, { user: true });

  await minimum_thread_host(ctx, thread);

  try {
    thread.delete();
    ctx.status = STATUS.NO_CONTENT;
  } catch (err) {
    error.call(ctx, err);
  }
}

// throws an error on ctx if the authenticated user is not the host or an admin
async function minimum_thread_host(ctx: BaseContext, { subreddit, created_by }: Thread) {
  const user = ctx.state.user_data!;

  if (
   user.is_global_admin !== true &&
   (user as any)[`${subreddit.toLowerCase()}__is_admin`] !== true && // is local admin
   user.username !== created_by.reddit_username // is thread creator
  ) {
   ctx.throw(
     STATUS.UNAUTHORIZED,
     'Must be authenticated as the thread host or an admin to access this endpoint.'
   );
  }
}
