import PresetEvent from '../entities/PresetEvent';
import { BaseContext } from '../helpers/BaseContext';
import { created, error, okay } from '../helpers/method_binds';
import STATUS from '../helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  ctx.body = await PresetEvent.find_all();
  ctx.status = STATUS.OK;
}

export function get(ctx: BaseContext) {
  return PresetEvent
    .find(ctx.query.id)
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export function create(ctx: BaseContext) {
  return new PresetEvent(ctx.request.body)
    .save()
    .then(created.bind(ctx))
    .catch(error.bind(ctx));
}

export function update(ctx: BaseContext) {
  return PresetEvent
    .find(ctx.params.id)
    .then(preset_event => preset_event.update(ctx.request.body))
    .then(preset_event => preset_event.save())
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export function remove(ctx: BaseContext) {
  return PresetEvent
    .find(ctx.params.id)
    .then(preset_event => preset_event.delete())
    .then(() => ctx.status = STATUS.NO_CONTENT)
    .catch(error.bind(ctx));
}
