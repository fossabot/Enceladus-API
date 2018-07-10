import { BaseContext } from 'koa';
export type BaseContext = BaseContext & { params: any, request: any };
