import Bluebird from 'bluebird';
import pick from 'lodash/pick';
import { knex } from '../create_tables';

export interface Section {
  id: number;
  content: string;
  name: string;
  events: number[]; // Event[]
  lock_held_by: number;
  thread_id: number;
}

const fields_config = {
  id: {
    create: false,
    update: false,
    returning: true,
  },
  content: {
    create: true,
    update: true,
    returning: true,
  },
  name: {
    create: true,
    update: true,
    returning: true,
  },
  events: {
    create: false,
    update: true,
    returning: true,
  },
  lock_held_by: {
    create: false,
    update: true,
    returning: true,
  },
  thread_id: {
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

function pick_first(value: Section[]): Section {
  if (value) {
    return value[0];
  }
  throw new Error('Section not found');
}

export default {
  exists(id: number): Bluebird<boolean> {
    return knex('section')
      .where({ id })
      .count()
      .then(count => !!count);
  },

  find(id: number): Bluebird<Section> {
    return (
      knex('section')
        // .innerJoin('event', 'event.in_section', 'section.id')
        .where({ 'section.id': id })
        .limit(1)
        .then(pick_first)
    );
  },

  find_all(): Bluebird<Section[]> {
    return knex('section').columns(returning_fields) as any;
  },

  // TODO verify thread exists
  create(fields: Partial<Section>): Bluebird<Section> {
    return knex('section')
      .insert({ ...pick(fields, create_fields), events: JSON.stringify([]) })
      .returning(returning_fields)
      .then(pick_first);
  },

  // TODO verify user and events exist
  update(id: number, fields: Partial<Section>): Bluebird<Section> {
    return knex('section')
      .update(pick(fields, update_fields))
      .where({ id })
      .returning(returning_fields)
      .then(pick_first);
  },

  delete(id: number) {
    return knex('section')
      .delete()
      .where({ id })
      .thenReturn();
  },
};
