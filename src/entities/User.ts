import once from 'lodash-decorators/once';
import assign from 'lodash/assign';
import pick from 'lodash/pick';
import property from 'lodash/property';
import {
  // AfterInsert,
  // AfterRemove,
  // AfterUpdate,
  Column,
  DeleteResult,
  Entity,
  FindManyOptions,
  FindOneOptions,
  getManager,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Queryable from './Queryable';
import Section from './Section';
import Thread from './Thread';
// import { sockets as io_namespace } from '../sockets';

interface UserFields {
  reddit_username?: string;
  lang?: string;
  refresh_token?: string;
  is_global_admin?: boolean;
  spacex__is_admin?: boolean;
  spacex__is_mod?: boolean;
  spacex__is_slack_member?: boolean;
  threads_created?: Promise<Thread[]>;
  section_locks_held?: Promise<Section[]>;
}

@Entity()
export default class User implements UserFields, Queryable {
  @once public static get repository() { return getManager().getRepository(User); }

  public static async find(
    id: number,
    joins?: { threads_created?: boolean, section_locks_held?: boolean },
  ): Promise<User> {
    const options: FindOneOptions = { relations: [] };
    if (joins && joins.threads_created) { options.relations!.push('threads_created'); }
    if (joins && joins.section_locks_held) { options.relations!.push('section_locks_held'); }

    const user = await User.repository.findOne(id, options);

    if (user === undefined) {
      throw new Error('User not found');
    }
    return user;
  }

  public static find_all(
    joins?: { threads_created?: boolean, section_locks_held?: boolean },
  ): Promise<User[]> {
    const options: FindManyOptions = { relations: [] };
    if (joins && joins.threads_created) { options.relations!.push('threads_created'); }
    if (joins && joins.section_locks_held) { options.relations!.push('section_locks_held'); }

    return User.repository.find(options);
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column({ unique: true, readonly: true }) public reddit_username: string;
  @Column() public lang: string;
  @Column({ readonly: true, select: false }) public refresh_token: string;
  @Column() public is_global_admin: boolean = false;
  @Column() public spacex__is_admin: boolean = false;
  @Column() public spacex__is_mod: boolean = false;
  @Column() public spacex__is_slack_member: boolean = false;
  @OneToMany(() => Thread, property('created_by')) public threads_created: Promise<Thread[]>;
  @OneToMany(() => Section, property('lock_held_by')) public section_locks_held: Promise<Section[]>;

  constructor(fields: UserFields = {}) {
    assign(
      this,
      pick(fields, [
        'reddit_username',
        'lang',
        'refresh_token',
        'is_global_admin',
        'spacex__is_admin',
        'spacex__is_mod',
        'spacex__is_slack_member',
      ]),
    );
  }

  public update(fields: UserFields = {}): this {
    assign(
      this,
      pick(fields, [
        'refresh_token',
        'lang',
        'is_global_admin',
        'spacex__is_admin',
        'spacex__is_mod',
        'spacex__is_slack_member',
      ]),
    );

    return this;
  }

  public delete(): Promise<DeleteResult> {
    return User.repository.delete(this.id);
  }

  public save(): Promise<this> {
    return User.repository.save(this);
  }

  // @AfterInsert() protected emit_insert() {
  //   io_namespace.user.emit('insert', JSON.stringify(this));
  // }

  // @AfterUpdate() protected emit_update() {
  //   io_namespace.user.emit('update', JSON.stringify(this));
  // }

  // @AfterRemove() protected emit_delete() {
  //   io_namespace.user.emit('delete', JSON.stringify(this));
  // }
}
