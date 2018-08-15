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
  return Section
    .find(ctx.params.id)
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export async function create(ctx: BaseContext) {
  const thread = await Thread.find(ctx.params.belongs_to_thread);

  await minimum_thread_host(ctx, thread);

  try {
    console.log(ctx.request.body);
    const section = await (await Section.new(ctx.request.body)).save();
    console.log(section);
    created.call(ctx, section);
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function update(ctx: BaseContext) {
  const section = await Section.find(ctx.params.id, { thread: true });

  await minimum_thread_host(ctx, await section.belongs_to_thread);

  try {
    (await section.update(ctx.request.body)).save();
    okay.call(ctx, section);
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function remove(ctx: BaseContext) {
  const section = await Section.find(ctx.params.id, { thread: true });

  await minimum_thread_host(ctx, await section.belongs_to_thread);

  try {
    section.delete();
    ctx.status = STATUS.NO_CONTENT;
  } catch (err) {
    error.call(ctx, err);
  }
}
