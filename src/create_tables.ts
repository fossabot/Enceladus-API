import Knex, { CreateTableBuilder } from 'knex';
import { config } from './config';

// knex connection
// will take place of the existing TypeORM connection at some point
export const knex = Knex({
  client: 'pg',
  connection: {
    host: config.db.host,
    port: config.db.port,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database,
  },
});

export async function create_tables() {
  if (!await knex.schema.hasTable('preset_event')) {
    await knex.schema.createTable('preset_event', (table: CreateTableBuilder) => {
      table.increments();
      table.boolean('holds_clock').notNullable().defaultTo(false);
      table.text('message').notNullable();
      table.string('name').notNullable();
    });
  }

  if (!await knex.schema.hasTable('user')) {
    await knex.schema.createTable('user', (table: CreateTableBuilder) => {
      table.increments('id');
      table.string('reddit_username').notNullable().unique().index();
      table.string('lang').notNullable().defaultTo('en');
      table.string('refresh_token').notNullable();
      table.boolean('is_global_admin').notNullable().defaultTo(false);
      table.boolean('spacex__is_admin').notNullable().defaultTo(false);
      table.boolean('spacex__is_mod').notNullable().defaultTo(false);
      table.boolean('spacex__is_slack_member').notNullable().defaultTo(false);
    });
  }

  if (!await knex.schema.hasTable('thread')) {
    await knex.schema.createTable('thread', (table: CreateTableBuilder) => {
      table.increments('id');
      table.string('launch_name').notNullable();
      table.string('subreddit').notNullable().index();
      table.string('post_id');
      table.integer('t0').unsigned();
      table.integer('take_number').unsigned().notNullable();
      table.string('youtube_id', 11);
      table.integer('created_by_id').unsigned().notNullable();
      table.string('spacex__api_id');

      table
        .text('sections')
        .notNullable()
        .comment('Stringified array of foreign keys. Must be manually managed.');

      table.unique(['subreddit', 'post_id']);

      table.foreign('created_by_id').references('id').inTable('user');
    });
  }

  if (!await knex.schema.hasTable('section')) {
    await knex.schema.createTable('section', (table: CreateTableBuilder) => {
      table.increments('id');
      table.text('content').notNullable();
      table.string('name').notNullable();
      table.integer('lock_held_by').unsigned().index();
      table.integer('thread_id').unsigned().notNullable().index();

      table
        .text('events')
        .notNullable()
        .comment('Stringified array of foreign keys. Must be manually managed.');

      table.foreign('lock_held_by').references('id').inTable('user');
      table.foreign('thread_id').references('id').inTable('user');
    });
  }

  if (!await knex.schema.hasTable('event')) {
    await knex.schema.createTable('event', (table: CreateTableBuilder) => {
      table.increments('id');
      table.boolean('posted').notNullable().defaultTo(false);
      table.text('message').notNullable().defaultTo('');
      table.string('terminal_count').notNullable().defaultTo('');
      table.integer('in_section').notNullable();

      table.foreign('in_section').references('id').inTable('section');
    });
  }
}
