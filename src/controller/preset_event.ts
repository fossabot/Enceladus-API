import { getManager } from 'typeorm';
import PresetEvent from '../entities/PresetEvent';
import { BaseContext } from './helpers/BaseContext';
import STATUS from './helpers/status_codes';

export async function get_all_preset_events(ctx: BaseContext) {
  const preset_event_repository = getManager().getRepository(PresetEvent);
  const preset_events = await preset_event_repository.find();

  ctx.status = STATUS.OK;
  ctx.body = preset_events;
}

export async function get_preset_event(ctx: BaseContext) {
  const preset_event_repository = getManager().getRepository(PresetEvent);
  const preset_event = await preset_event_repository.findOne(ctx.query.id);

  if (preset_event === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'Preset event not found';
    return;
  }

  ctx.status = STATUS.OK;
  ctx.body = preset_event;
}

export async function create_preset_event(ctx: BaseContext) {
  const preset_event_repository = getManager().getRepository(PresetEvent);
  const preset_event_to_save = new PresetEvent({ ...ctx.request.body });

  const preset_event = await preset_event_repository.save(preset_event_to_save);

  if (preset_event) {
    ctx.status = STATUS.CREATED;
    ctx.body = preset_event;
  } else {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = '';
  }
}

export async function update_preset_event(ctx: BaseContext) {
  const preset_event_repository = getManager().getRepository(PresetEvent);

  if (ctx.params.id === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'No id provided';
    return;
  }

  const preset_event_to_update = await preset_event_repository.findOne(ctx.params.id);

  if (preset_event_to_update === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'Preset event not found';
    return;
  }

  // fields that can be updated
  [
    'holds_clock',
    'message',
    'name',
  ].forEach(field => {
    if (ctx.request.body[field] !== undefined) {
      preset_event_to_update[field] = ctx.request.body[field];
    }
  });

  const preset_event = await preset_event_repository.save(preset_event_to_update);
  ctx.status = STATUS.OK;
  ctx.body = preset_event;
}

export async function delete_preset_event(ctx: BaseContext) {
  const preset_event_repository = getManager().getRepository(PresetEvent);
  const preset_event_to_delete = await preset_event_repository.findOne(ctx.params.id);

  if (preset_event_to_delete === undefined) {
    ctx.status = STATUS.BAD_REQUEST;
    ctx.body = 'Preset event not found';
    return;
  }

  await preset_event_repository.delete(preset_event_to_delete);
  ctx.status = STATUS.NO_CONTENT;
}
