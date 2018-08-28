import { knex } from '..';
import { Event } from '../entities';
import { BaseContext } from '../helpers/BaseContext';
import { created, error, okay } from '../helpers/method_binds';
import STATUS from '../helpers/status_codes';
import { minimum_thread_host } from './thread';

export async function get_all(ctx: BaseContext) {
  ctx.body = await Event.find_all();
  ctx.status = STATUS.OK;
}

export function get(ctx: BaseContext) {
  return Event.find(ctx.params.id)
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export async function create(ctx: BaseContext) {
  await minimum_thread_host(ctx, await authentication_data(ctx.request.body.in_section));

  try {
    const event = await Event.create(ctx.request.body);
    created.call(ctx, event);
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function update(ctx: BaseContext) {
  await minimum_thread_host(ctx, await authentication_data(ctx.params.id));

  try {
    const event = await Event.update(ctx.params.id, ctx.request.body);
    okay.call(ctx, event);
  } catch (err) {
    error.call(ctx, err);
  }
}

export async function remove(ctx: BaseContext) {
  await minimum_thread_host(ctx, await authentication_data(ctx.params.id));

  try {
    Event.delete(ctx.params.id);
    ctx.status = STATUS.NO_CONTENT;
  } catch (err) {
    error.call(ctx, err);
  }
}

function authentication_data(section_id: number) {
  return knex('section')
    .column([
      'thread.subreddit',
      'user.id',
      'user.spacex__is_admin',
    ])
    .join('thread', 'thread.id', 'section.thread_id')
    .join('user', 'thread.created_by', 'user.id')
    .where({ 'section.id': section_id })
    .limit(1);
}
