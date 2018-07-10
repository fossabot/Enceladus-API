import {
  /* AfterInsert, AfterRemove, AfterUpdate,*/ Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
// import { sockets as io_namespace } from '../sockets';
import Section from './Section';
import Thread from './Thread';

interface UserFields {
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

  @PrimaryGeneratedColumn() public id: number;
  @Column({ unique: true }) public reddit_username: string;
  @Column() public auth_token: string;
  @Column() public is_global_admin: boolean = false;
  @Column() public spacex__is_admin: boolean = false;
  @Column() public spacex__is_mod: boolean = false;
  @Column() public spacex__is_slack_member: boolean = false;
  @OneToMany(() => Thread, thread => thread.created_by) public threads_created: Thread[];
  @OneToMany(() => Section, section => section.lock_held_by) public section_locks_held: Section[];

  constructor(fields: UserFields = {}) {
    const {
      reddit_username,
      auth_token,
      is_global_admin,
      spacex__is_admin,
      spacex__is_mod,
      spacex__is_slack_member,
    }: UserFields = fields;

    if (reddit_username !== undefined) { this.reddit_username = reddit_username; }
    if (auth_token !== undefined) { this.auth_token = auth_token; }
    if (is_global_admin !== undefined) { this.is_global_admin = is_global_admin; }
    if (spacex__is_admin !== undefined) { this.spacex__is_admin = spacex__is_admin; }
    if (spacex__is_mod !== undefined) { this.spacex__is_mod = spacex__is_mod; }
    if (spacex__is_slack_member !== undefined) {
      this.spacex__is_slack_member = spacex__is_slack_member;
    }
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
