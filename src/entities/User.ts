import assign from 'lodash/assign';
import pick from 'lodash/pick';
import {
  // AfterInsert,
  // AfterRemove,
  // AfterUpdate,
  Column,
  DeleteResult,
  Entity,
  getManager,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Queryable } from './Queryable';
// import { sockets as io_namespace } from '../sockets';
import Section from './Section';
import Thread from './Thread';

interface UserFields {
  [key: string]: any;

  reddit_username?: string;
  lang?: string;
  refresh_token?: string;
  is_global_admin?: boolean;
  spacex__is_admin?: boolean;
  spacex__is_mod?: boolean;
  spacex__is_slack_member?: boolean;
}

@Entity()
export default class User implements UserFields, Queryable {
  [key: string]: any;

  public static async find(id: number): Promise<User> {
    const user = await getManager()
      .getRepository(User)
      .findOne(id);

    if (user === undefined) {
      return Promise.reject('User not found');
    }
    return Promise.resolve(user);
  }

  public static find_all(): Promise<User[]> {
    return getManager()
      .getRepository(User)
      .find();
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column({ unique: true, readonly: true }) public reddit_username: string;
  @Column() public lang: string;
  @Column({ readonly: true }) public refresh_token: string;
  @Column() public is_global_admin: boolean = false;
  @Column() public spacex__is_admin: boolean = false;
  @Column() public spacex__is_mod: boolean = false;
  @Column() public spacex__is_slack_member: boolean = false;
  @OneToMany(() => Thread, thread => thread.created_by) public threads_created: Thread[];
  @OneToMany(() => Section, section => section.lock_held_by) public section_locks_held: Section[];

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
    return getManager()
      .getRepository(User)
      .delete(this);
  }

  public save(): Promise<this> {
    return getManager()
      .getRepository(User)
      .save(this);
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
