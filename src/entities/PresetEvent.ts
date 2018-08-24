import { knex } from '..';

interface Fields {
  id: number;
  holds_clock: boolean;
  message: string;
  name: string;
}

interface OptionalFields {
  id?: number;
  holds_clock?: boolean;
  message?: string;
  name?: string;
}

const fields_array = [
  'id',
  'holds_clock',
  'message',
  'name',
];

// tslint:disable-next-line array-type
function pick_first(value: Fields[]): Fields {
  if (value) {
    return value[0];
  }
  throw new Error('Preset event not found');
}

export default {
  find(id: number): PromiseLike<Fields> {
    return knex('preset_event')
      .where({ id })
      .limit(1)
      .then(pick_first);
  },

  find_all(): PromiseLike<Fields[]> {
    return knex('preset_event');
  },

  create(params: Fields): PromiseLike<Fields> {
    // by default, the name is equal to the message
    if (params.name === undefined) {
      params.name = params.message;
    }

    return knex('preset_event')
      .insert(params)
      .returning(fields_array)
      .then(pick_first);
  },

  update({ id, holds_clock, message, name }: OptionalFields): PromiseLike<Fields> {
    return knex('preset_event')
      .update({ holds_clock, message, name })
      .where({ id })
      .returning(fields_array)
      .then(pick_first);
  },

  delete(id: number): PromiseLike<void> {
    return knex('preset_event')
      .delete()
      .where({ id })
      .thenReturn();
  },
};
