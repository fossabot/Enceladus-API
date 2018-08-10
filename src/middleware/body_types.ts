import memoize from 'lodash/memoize';
import { BaseContext } from '../controller/helpers/BaseContext';

export async function body_types(ctx: BaseContext, next: () => Promise<unknown>) {
  const { body } = ctx.request;

  Object.entries(body).forEach(memoize(([key, value]: [string, any]) => {
    if (value === 'true') {
      body[key] = true;
    } else if (value === 'false') {
      body[key] = false;
    } else if (value === 'null') {
      body[key] = null;
    } else if (/^\d+$/.test(value)) {
      body[key] = parseInt(value, 10);
    } else if (/^\d+\.\d+$/.test(value)) {
      body[key] = parseFloat(value);
    }
  }));

  await next();
}
