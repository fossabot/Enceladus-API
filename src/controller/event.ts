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

export function update(ctx: BaseContext) {
  return Event
    .find(ctx.params.id)
    .then(event => event.update(ctx.request.body))
    .then(event => event.save())
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export function remove(ctx: BaseContext) {
  return Event
    .find(ctx.params.id)
    .then(event => event.delete())
    .then(() => ctx.status = STATUS.NO_CONTENT)
    .catch(error.bind(ctx));
}
