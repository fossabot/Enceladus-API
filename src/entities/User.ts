import Bluebird from 'bluebird';
import pick from 'lodash/pick';
import { knex } from '..';

export interface User {
  id: number;
  reddit_username: string;
  lang: string;
  refresh_token: string;
  is_global_admin: boolean;
  spacex__is_admin: boolean;
  spacex__is_mod: boolean;
  spacex__is_slack_member: boolean;
}

const fields_config = {
  id: {
    create: false,
    update: false,
    returning: true,
  },
  reddit_username: {
    create: true,
    update: false,
    returning: true,
  },
  lang: {
    create: true,
    update: true,
    returning: true,
  },
  refresh_token: {
    create: true,
    update: true,
    returning: false,
  },
  is_global_admin: {
    create: true,
    update: true,
    returning: true,
  },
  spacex__is_admin: {
    create: true,
    update: true,
    returning: true,
  },
  spacex__is_mod: {
    create: true,
    update: true,
    returning: true,
  },
  spacex__is_slack_member: {
    create: true,
    update: true,
    returning: true,
  },
};

const create_fields = Object.entries(fields_config)
  .filter(([_, { create }]) => create)
  .map(([key, _]) => key);

const update_fields = Object.entries(fields_config)
  .filter(([_, { update }]) => update)
  .map(([key, _]) => key);

const returning_fields = Object.entries(fields_config)
  .filter(([_, { returning }]) => returning)
  .map(([key, _]) => key);

function pick_first(value: User[]): User {
  if (value) {
    return value[0];
  }
  throw new Error('User not found');
}

export default {
  find(id: number): Bluebird<User> {
    return knex('user')
      .where({ id })
      .column(returning_fields)
      .limit(1)
      .then(pick_first);
  },

  find_all(): Bluebird<User[]> {
    return knex('user').columns(returning_fields) as any;
  },

  create(fields: Partial<User>): Bluebird<User> {
    return knex('user')
      .insert(pick(fields, create_fields))
      .returning(returning_fields)
      .then(pick_first);
  },

  update(id: number, fields: Partial<User>): Bluebird<User> {
    return knex('user')
      .update(pick(fields, update_fields))
      .where({ id })
      .returning(returning_fields)
      .then(pick_first);
  },

  delete(id: number): Bluebird<void> {
    return knex('user')
      .delete()
      .where({ id })
      .thenReturn();
  },
};
