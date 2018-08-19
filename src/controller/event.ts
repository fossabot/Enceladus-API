import omit from 'lodash/omit';
import { Event, Section } from '../entities';
import { BaseContext } from '../helpers/BaseContext';
import { created, error, okay } from '../helpers/method_binds';
import STATUS from '../helpers/status_codes';
import { minimum_thread_host } from './thread';

function omit_underscore_props(section: Event): Partial<Event> {
  return omit(section, '__belongs_to_section__', '__has_belongs_to_section__');
}

export async function get_all(ctx: BaseContext) {
  ctx.body = await Event.find_all();
  ctx.status = STATUS.OK;
}

export function get(ctx: BaseContext) {
  return Event
    .find(ctx.params.id)
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export async function create(ctx: BaseContext) {
  const section = await Section.find(ctx.request.belongs_to_section, { thread: true });

  await minimum_thread_host(ctx, await section.thread);

  try {
    const event = await (await Event.new(ctx.request.body)).save();
    created.call(ctx, omit_underscore_props(event));
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function update(ctx: BaseContext) {
  const event = await Event.find(ctx.params.id, { section: true });

  await minimum_thread_host(ctx, await (await event.section).thread);

  await event.update(ctx.request.body).save();

  try {
    okay.call(ctx, omit_underscore_props(event));
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function remove(ctx: BaseContext) {
  const event = await Event.find(ctx.params.id, { section: true });

  await minimum_thread_host(ctx, await (await event.section).thread);

  try {
    event.delete();
    ctx.status = STATUS.NO_CONTENT;
  } catch (err) {
    error.call(ctx, err);
  }
}
