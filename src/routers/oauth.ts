import jwt from 'jsonwebtoken';
import Router from 'koa-router';
import Reddit from 'orangered';
import { config } from '../config';
import STATUS from '../helpers/status_codes';

import User from '../entities/User';

export const router = new Router();

const pending_states: { [key: string]: string } = {};

router.get('/oauth', ctx => {
  const { callback: callback_url } = ctx.query;
  const [auth_url, state] = Reddit.auth_url_and_state();

  pending_states[state] = callback_url;
  // tslint:disable-next-line no-shadowed-variable
  Reddit.on('state_expiration', (state: string) => delete pending_states[state]);
  ctx.body = { url: auth_url };
  ctx.status = STATUS.OK;
});

router.get('/oauth/callback', async ctx => {
  const { code, state } = ctx.query;

  const callback_url = pending_states[state];
  if (callback_url === undefined) {
    ctx.status = STATUS.GONE;
    ctx.body = "Oh no! We don't have that state any more. Consider trying " +
      'again from your preferred client.';
    return;
  }

  const reddit = await new Reddit().auth({ code, state });
  const [{ name: reddit_username }, { lang }] = await Promise.all([
    reddit.me(),
    reddit.prefs(),
  ]);

  const { refresh_token } = reddit;

  // we have all the information necessary.
  // let's create a user in the database.
  await new User({
    reddit_username,
    lang,
    refresh_token,
    is_global_admin: false,
    spacex__is_admin: false,
    spacex__is_mod: false,
    spacex__is_slack_member: false,
  }).save();

  const token = jwt.sign({ user: reddit_username }, config.jwt_secret, { noTimestamp: true });
  ctx.status = STATUS.SEE_ALSO;
  ctx.redirect(`${callback_url}?token=${token}`);
});
