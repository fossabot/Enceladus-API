import Reddit from 'orangered';

Reddit.configure(
  'Enceladus API v0.1.0 by u/theZcuber',
  process.env.APP_CLIENT_ID || '',
  process.env.APP_SECRET || '',
  process.env.APP_CALLBACK || '',
  ['identity', 'submit', 'edit', 'modposts'],
);
