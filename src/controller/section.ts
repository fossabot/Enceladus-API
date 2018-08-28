import { Section, Thread } from '../entities';
import { BaseContext } from '../helpers/BaseContext';
import { created, error, okay } from '../helpers/method_binds';
import STATUS from '../helpers/status_codes';
import { minimum_thread_host } from './thread';

export async function get_all(ctx: BaseContext) {
  ctx.body = await Section.find_all();
  ctx.status = STATUS.OK;
}

export function get(ctx: BaseContext) {
  return Section.find(ctx.params.id)
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export async function create(ctx: BaseContext) {
  await minimum_thread_host(ctx, await Thread.find(ctx.request.body.thread_id));

  try {
    const section = await Section.create(ctx.request.body);
    created.call(ctx, section);
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function update(ctx: BaseContext) {
  let section = await Section.find(ctx.params.id);

  await minimum_thread_host(ctx, await Thread.find(section.thread_id));

  try {
    section = await Section.update(ctx.params.id, ctx.request.body);
    okay.call(ctx, section);
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function remove(ctx: BaseContext) {
  const section = await Section.find(ctx.params.id);

  await minimum_thread_host(ctx, await Thread.find(section.thread_id));

  try {
    Section.delete(ctx.params.id);
    ctx.status = STATUS.NO_CONTENT;
  } catch (err) {
    error.call(ctx, err);
  }
}
