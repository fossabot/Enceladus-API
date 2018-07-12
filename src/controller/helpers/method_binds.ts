import { BaseContext } from './BaseContext';
import STATUS from './status_codes';

export function error(this: BaseContext, err: any) {
  this.body = err;
  this.status = STATUS.BAD_REQUEST;
}

export function okay(this: BaseContext, obj: any) {
  this.body = obj;
  this.status = STATUS.OK;
}

export function created(this: BaseContext, obj: any) {
  this.body = obj;
  this.status = STATUS.CREATED;
}
