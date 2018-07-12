import PresetEvent from '../entities/PresetEvent';
import { BaseContext } from './helpers/BaseContext';
import STATUS from './helpers/status_codes';

export async function get_all(ctx: BaseContext) {
  ctx.body = await PresetEvent.find_all();
  ctx.status = STATUS.OK;
}

export async function get(ctx: BaseContext) {
  const preset_event = await PresetEvent.find(ctx.query.id);

  if (preset_event === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'Preset event not found';
    return;
  }

  ctx.body = preset_event;
  ctx.status = STATUS.OK;
}

export async function create(ctx: BaseContext) {
  const preset_event = new PresetEvent(ctx.request.body);

  if (preset_event) {
    ctx.body = await preset_event.save();
    ctx.status = STATUS.CREATED;
  } else {
    ctx.body = '';
    ctx.status = STATUS.BAD_REQUEST;
  }
}

export async function update(ctx: BaseContext) {
  if (ctx.params.id === undefined) {
    ctx.body = 'No id provided';
    ctx.status = STATUS.BAD_REQUEST;
    return;
  }

  const preset_event = await PresetEvent.find(ctx.params.id);

  if (preset_event === undefined) {
    ctx.body = 'Preset event not found';
    ctx.status = STATUS.BAD_REQUEST;
    return;
  }

  ctx.body = await preset_event.update(ctx.request.body).save();
  ctx.status = STATUS.OK;
}

export async function remove(ctx: BaseContext) {
  const preset_event = await PresetEvent.find(ctx.params.id);

  if (preset_event === undefined) {
    ctx.body = 'Preset event not found';
    ctx.status = STATUS.BAD_REQUEST;
    return;
  }

  await preset_event.delete();
  ctx.status = STATUS.NO_CONTENT;
}
