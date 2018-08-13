import Section from '../entities/Section';
import { BaseContext } from '../helpers/BaseContext';
import { created, error, okay } from '../helpers/method_binds';
import STATUS from '../helpers/status_codes';

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

// TODO additional middleware necessary on routes below
export function create(ctx: BaseContext) {
  return new Section(ctx.request.body)
    .save()
    .then(created.bind(ctx))
    .catch(error.bind(ctx));
}

export function update(ctx: BaseContext) {
  return Section
    .find(ctx.params.id)
    .then(section => section.update(ctx.request.body))
    .then(section => section.save())
    .then(okay.bind(ctx))
    .catch(error.bind(ctx));
}

export function remove(ctx: BaseContext) {
  return Section
    .find(ctx.params.id)
    .then(section => section.delete())
    .then(() => ctx.status = STATUS.NO_CONTENT)
    .catch(error.bind(ctx));
}
