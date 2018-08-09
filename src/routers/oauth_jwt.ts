// import jwt from 'jsonwebtoken';
import Reddit from 'orangered';
import { BaseContext } from '../controller/helpers/BaseContext';

Reddit.configure(
  'Enceladus API v0.1.0 by u/theZcuber',
  process.env.APP_CLIENT_ID || '',
  process.env.APP_SECRET || '',
  process.env.APP_CALLBACK || '',
  ['identity', 'submit', 'edit', 'modposts'],
);

// const url = Reddit.auth_url;

export async function endpoint(_ctx: BaseContext) {
  await new Reddit().auth('refresh_token');
}
