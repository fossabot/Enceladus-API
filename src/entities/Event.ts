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
  getManager,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Queryable from './Queryable';
import Section from './Section';
// import { sockets as io_namespace } from '../sockets';

interface EventFields {
  message?: string;
  posted?: boolean;
  terminal_count?: string;
}

@Entity()
export default class Event implements EventFields, Queryable {
  public static async find(id: number): Promise<Event> {
    const event = await getManager()
      .getRepository(Event)
      .findOne(id);

    if (event === undefined) {
      throw new Error('Event not found');
    }
    return event;
  }

  public static find_all(): Promise<Event[]> {
    return getManager()
      .getRepository(Event)
      .find();
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column('text') public message: string = '';
  @Column() public posted: boolean = false;
  @Column() public terminal_count: string = '';
  @ManyToOne(() => Section, property('events')) public belongs_to_section: Section;

  constructor(fields: EventFields = {}) {
    assign(this, pick(fields, ['message', 'posted', 'terminal_count']));
  }

  public update(fields: EventFields = {}): this {
    return assign(this, pick(fields, ['message', 'posted', 'terminal_count']));
  }

  public delete(): Promise<DeleteResult> {
    return getManager()
      .getRepository(Event)
      .delete(this.id);
  }

  public save(): Promise<this> {
    return getManager()
      .getRepository(Event)
      .save(this);
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
