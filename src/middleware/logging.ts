import Koa from 'koa';
import Winston from 'winston';
import { config } from '../config';
import STATUS from '../controller/helpers/status_codes';

export function logger(winston: typeof Winston) {
  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    const start = Date.now();

    await next();

    const ms = Date.now() - start;

    let log_level: string = 'info';
    if (ctx.status >= 400) { log_level = 'warn'; }
    if (ctx.status >= 500) { log_level = 'error'; }

    // overrides
    if (ctx.status === STATUS.RATE_LIMITED) { log_level = 'warn'; }
    if (ctx.status === STATUS.NOT_IMPLEMENTED) { log_level = 'info'; }

    const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

    winston.configure({
      level: config.debug_logging ? 'debug' : 'info',
      transports: [
        new Winston.transports.Console(),
      ],
    });

    winston.log(log_level, msg);
  };
}
