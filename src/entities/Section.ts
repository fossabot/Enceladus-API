import assign from 'lodash/assign';
import pick from 'lodash/pick';
import {
  /* AfterInsert, AfterRemove, AfterUpdate,*/ Column, Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { sockets as io_namespace } from '../sockets';
import { Event, Thread, User } from '.';

interface SectionFields {
  content?: string;
  name?: string;
}

@Entity()
export default class Section implements SectionFields {
  @PrimaryGeneratedColumn() public id: number;
  @Column('text') public content: string = '';
  @Column() public name: string;
  @OneToMany(() => Event, event => event.belongs_to_section) public events: Event[];
  @ManyToOne(() => User, user => user.section_locks_held) public lock_held_by: User;
  @ManyToOne(() => Thread, thread => thread.sections) public belongs_to_thread: Thread;

  constructor(fields: SectionFields = {}) {
    assign(this, pick(fields, ['content', 'name']));
  }

  // @AfterInsert() protected emit_insert() {
  //   io_namespace.section.emit('insert', JSON.stringify(this));
  // }

  // @AfterUpdate() protected emit_update() {
  //   io_namespace.section.emit('update', JSON.stringify(this));
  // }

  // @AfterRemove() protected emit_delete() {
  //   io_namespace.section.emit('delete', JSON.stringify(this));
  // }
}
