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
// import { sockets as io_namespace } from '../sockets';
import Section from './Section';
import Thread from './Thread';

interface UserFields {
  [key: string]: any;

  reddit_username?: string;
  auth_token?: string;
  is_global_admin?: boolean;
  spacex__is_admin?: boolean;
  spacex__is_mod?: boolean;
  spacex__is_slack_member?: boolean;
}

@Entity()
export default class User implements UserFields {
  [key: string]: any;

  public static async exists(id: number): Promise<boolean> {
    return await User.find(id) !== undefined;
  }

  public static find(id: number): Promise<Option<User>> {
    return getManager().getRepository(User).findOne(id);
  }

  public static find_all(): Promise<User[]> {
    return getManager().getRepository(User).find();
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column({ unique: true, readonly: true }) public reddit_username: string;
  @Column({ readonly: true }) public auth_token: string;
  @Column() public is_global_admin: boolean = false;
  @Column() public spacex__is_admin: boolean = false;
  @Column() public spacex__is_mod: boolean = false;
  @Column() public spacex__is_slack_member: boolean = false;
  @OneToMany(() => Thread, thread => thread.created_by) public threads_created: Thread[];
  @OneToMany(() => Section, section => section.lock_held_by) public section_locks_held: Section[];

  constructor(fields: UserFields = {}) {
    [
      'reddit_username',
      'auth_token',
      'is_global_admin',
      'spacex__is_admin',
      'spacex__is_mod',
      'spacex__is_slack_member',
    ].forEach(field => {
      if (fields[field] !== undefined) {
        this[field] = fields[field];
      }
    });
  }

  public update(fields: UserFields = {}): this {
    [
      'auth_token',
      'is_global_admin',
      'spacex__is_admin',
      'spacex__is_mod',
      'spacex__is_slack_member',
    ].forEach(field => {
      if (fields[field] !== undefined) {
        this[field] = fields[field];
      }
    });

    return this;
  }

  public delete(): Promise<DeleteResult> {
    return getManager().getRepository(User).delete(this);
  }

  public save(): Promise<this> {
    return getManager().getRepository(User).save(this);
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
