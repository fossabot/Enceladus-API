import IO from 'koa-socket';

export const sockets = Object.freeze({
  event: new IO('/event'),
  preset_event: new IO('/preset_event'),
  section: new IO('/section'),
  thread: new IO('/thread'),
  user: new IO('/user'),
});
