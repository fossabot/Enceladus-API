import Bluebird from 'bluebird';
import pick from 'lodash/pick';
import { knex } from '..';
import User from './User';

export interface Thread {
  id: number;
  launch_name: string;
  post_id: string | null;
  subreddit: string;
  t0: number | null;
  take_number: number;
  youtube_id: string | null;
  spacex__api_id: string | null;
  created_by: number; // User
  sections: number[]; // Section[]
}

const fields_config = {
  id: {
    create: false,
    update: false,
    returning: true,
  },
  launch_name: {
    create: true,
    update: false,
    returning: true,
  },
  post_id: {
    create: false,
    update: false,
    returning: true,
  },
  subreddit: {
    create: true,
    update: false,
    returning: true,
  },
  t0: {
    create: true,
    update: true,
    returning: true,
  },
  take_number: {
    create: true,
    update: false,
    returning: true,
  },
  youtube_id: {
    create: true,
    update: true,
    returning: true,
  },
  spacex__api_id: {
    create: true,
    update: true,
    returning: true,
  },
  created_by: {
    create: true,
    update: false,
    returning: true,
  },
  sections: {
    create: false,
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

function pick_first(value: Thread[]): Thread {
  if (value) {
    return value[0];
  }
  throw new Error('Thread not found');
}

export default {
  exists(id: number): Bluebird<boolean> {
    return knex('thread')
      .where({ id })
      .count()
      .then(count => !!count);
  },

  find(id: number): Bluebird<Thread> {
    return knex('thread')
      .where({ id })
      .limit(1)
      .then(pick_first);
  },

  find_all(): Bluebird<Thread[]> {
    return knex('thread').columns(returning_fields) as any;
  },

  // union with unknown indexable because TypeScript doesn't like partial types
  async create(
    fields: Partial<Thread> & { [key: string]: unknown },
  ): Promise<Thread> {
    const missing_fields = create_fields.filter(
      field => fields[field] === undefined,
    );
    if (missing_fields.length !== 0) {
      throw new Error(`Missing field(s): ${missing_fields.join(', ')}`);
    }

    if (!(await User.exists(fields.created_by!))) {
      throw new Error('User not found');
    }

    const value = await knex('thread')
      .insert({ ...pick(fields, create_fields), sections: '[]' })
      .returning(returning_fields)
      .then(pick_first);

    return value;
  },

  update(id: number, fields: Partial<Thread>): Bluebird<Thread> {
    return knex('thread')
      .update(pick(fields, update_fields))
      .where({ id })
      .returning(returning_fields)
      .then(pick_first);
  },

  delete(id: number): Bluebird<void> {
    return knex('thread')
      .delete()
      .where({ id })
      .thenReturn();
  },
};
