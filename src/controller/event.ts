import Event from '../entities/Event';
import { BaseContext } from '../helpers/BaseContext';
import { created, error, okay } from '../helpers/method_binds';
import STATUS from '../helpers/status_codes';

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

// TODO additional middleware necessary on routes below
export function create(ctx: BaseContext) {
  return new Event(ctx.request.body)
    .save()
    .then(created.bind(ctx))
    .catch(error.bind(ctx));
}

export async function update(ctx: BaseContext) {
  const event = await Event.find(ctx.params.id, { section: true });
  const section = await event.belongs_to_section;
  const thread = await section.belongs_to_thread;

  console.log(event);
  console.log(section);
  console.log(thread);

  try {
    event.update(ctx.request.body).save();
    okay.call(ctx, event);
  } catch (err) {
    error.call(ctx, err);
  }
}

export function remove(ctx: BaseContext) {
  return Event
    .find(ctx.params.id)
    .then(event => event.delete())
    .then(() => ctx.status = STATUS.NO_CONTENT)
    .catch(error.bind(ctx));
}
