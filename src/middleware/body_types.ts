import { BaseContext } from '../controller/helpers/BaseContext';

export async function body_types(ctx: BaseContext, next: () => Promise<any>) {
  const { body } = ctx.request;

  Object.entries(body).forEach(([key, value]: [string, any]) => {
    if (value === 'true') {
      ctx.request.body[key] = true;
    } else if (value === 'false') {
      ctx.request.body[key] = false;
    } else if (value === 'null') {
      ctx.request.body[key] = null;
    } else if (/^\d+$/.test(value)) {
      ctx.request.body[key] = parseInt(value, 10);
    } else if (/^\d+\.\d+$/.test(value)) {
      ctx.request.body[key] = parseFloat(value);
    }
  });

  await next();
}
