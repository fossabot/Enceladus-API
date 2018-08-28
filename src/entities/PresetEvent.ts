import Bluebird from 'bluebird';
import pick from 'lodash/pick';
import { knex } from '..';

export interface PresetEvent {
  id: number;
  holds_clock: boolean;
  message: string;
  name: string;
}

const fields_config = {
  id: {
    create: false,
    update: false,
    returning: true,
  },
  holds_clock: {
    create: true,
    update: true,
    returning: true,
  },
  message: {
    create: true,
    update: true,
    returning: true,
  },
  name: {
    create: true,
    update: true,
    returning: true,
  }
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

function pick_first(value: PresetEvent[]): PresetEvent {
  if (value) {
    return value[0];
  }
  throw new Error('Preset event not found');
}

export default {
  find(id: number): Bluebird<PresetEvent> {
    return knex('preset_event')
      .where({ id })
      .limit(1)
      .then(pick_first);
  },

  find_all(): Bluebird<PresetEvent[]> {
    return knex('preset_event').columns(returning_fields) as any;
  },

  create(fields: Partial<PresetEvent>): Bluebird<PresetEvent> {
    // by default, the name is equal to the message
    if (fields.name === undefined) {
      fields.name = fields.message;
    }

    return knex('preset_event')
      .insert(pick(fields, create_fields))
      .returning(returning_fields)
      .then(pick_first);
  },

  update(id: number, fields: Partial<PresetEvent>): Bluebird<PresetEvent> {
    return knex('preset_event')
      .update(pick(fields, update_fields))
      .where({ id })
      .returning(returning_fields)
      .then(pick_first);
  },

  delete(id: number): Bluebird<void> {
    return knex('preset_event')
      .delete()
      .where({ id })
      .thenReturn();
  },
};
