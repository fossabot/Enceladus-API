import Bluebird from 'bluebird';
import assign from 'lodash/assign';
import pick from 'lodash/pick';
import { knex } from '..';

interface Event {
  message: string;
  posted: boolean;
  terminal_count: string;
  in_section: number;
}

const fields_config = {
  id: {
    create: false,
    update: false,
    returning: true,
  },
  message: {
    create: true,
    update: true,
    returning: true,
  },
  posted: {
    create: true,
    update: true,
    returning: true,
  },
  terminal_count: {
    create: true,
    update: true,
    returning: true,
  },
  in_section: {
    create: true,
    update: false,
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

function pick_first(value: Event[]): Event {
  if (value) {
    return value[0];
  }
  throw new Error('Event not found');
}

export default {
  exists(id: number): Bluebird<boolean> {
    return knex('event')
      .where({ id })
      .count()
      .then(count => !!count);
  },

  find(id: number) {
    return knex('event')
      .where({ id })
      .limit(1)
      .then(pick_first);
  },

  find_all(): Bluebird<Event> {
    return knex('event').columns(returning_fields) as any;
  },

  // TODO verify section exists
  create(fields: Partial<Event>): Bluebird<Event> {
    return knex('event')
      .insert(pick(fields, create_fields))
      .returning(returning_fields)
      .then(pick_first);
  },

  update(id: number, fields: Partial<Event>): Bluebird<Event> {
    return knex('event')
      .update(pick(fields, update_fields))
      .where({ id })
      .returning(returning_fields)
      .then(pick_first)
      .then(event => assign(event, pick(fields, update_fields)));
  },

  delete(id: number) {
    return knex('event')
      .delete()
      .where({ id })
      .thenReturn();
  },
};
