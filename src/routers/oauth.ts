import jwt from 'jsonwebtoken';
import Router from 'koa-router';
import Reddit from 'orangered';
import { config } from '../config';
import STATUS from '../controller/helpers/status_codes';

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
    ctx.status = 410; // 410 GONE
    ctx.body = "Oh no! We don't have that state any more. Users must be " +
      'authenticated within one hour of the original request, or else we ' +
      'lose the information we need. Consider trying again from your ' +
      'preferred client.';
    return;
  }

  const reddit = await new Reddit().auth({ code, state });
  const { refresh_token } = reddit;
  const { name: reddit_username } = await reddit.me();
  const { lang } = await reddit.prefs();

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

  const token = jwt.sign({ username: reddit_username }, config.jwt_secret);
  ctx.status = 303;
  ctx.redirect(callback_url + '?token=' + token);
});
