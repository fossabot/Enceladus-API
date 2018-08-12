import assign from 'lodash/assign';
import pick from 'lodash/pick';
import property from 'lodash/property';
import {
  /* AfterInsert, AfterRemove, AfterUpdate,*/ Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
// import { sockets as io_namespace } from '../sockets';
import Section from './Section';

interface EventFields {
  message?: string;
  posted?: boolean;
  terminal_count?: string;
}

@Entity()
export default class Event implements EventFields {
  @PrimaryGeneratedColumn() public id: number;
  @Column('text') public message: string = '';
  @Column() public posted: boolean = false;
  @Column() public terminal_count: string = '';
  @ManyToOne(() => Section, property('events')) public belongs_to_section: Section;

  constructor(fields: EventFields = {}) {
    assign(this, pick(fields, ['message', 'posted', 'terminal_count']));
  }

  // @AfterInsert() protected emit_insert() {
  //   io_namespace.event.emit('insert', JSON.stringify(this));
  // }

  // @AfterUpdate() protected emit_update() {
  //   io_namespace.event.emit('update', JSON.stringify(this));
  // }

  // @AfterRemove() protected emit_delete() {
  //   io_namespace.event.emit('delete', JSON.stringify(this));
  // }
}
