import memoize from 'memoizee';
import { BaseContext } from '../helpers/BaseContext';

const parse_value: (value: any) => any = memoize(
  (value: any) => {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    if (value === 'null') {
      return null;
    }
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10);
    }
    if (/^\d+\.\d+$/.test(value)) {
      return parseFloat(value);
    }
    return value;
  },
  {
    max: 1_000,
    primitive: true, // toString() is a valid identifier
  },
);

export async function body_types(ctx: BaseContext, next: () => Promise<unknown>) {
  const { body } = ctx.request;

  Object.entries(body).forEach(([key, value]: [string, any]) => {
    body[key] = parse_value(value);
  });

  await next();
}
