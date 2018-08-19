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
  section?: Promise<Section>;
}

interface EventFieldsParams {
  message?: string;
  posted?: boolean;
  terminal_count?: string;
  section?: number;
}

@Entity()
export default class Event implements EventFields, Queryable {
  @once public static get repository() { return getManager().getRepository(Event); }

  public static find(id: number, joins?: { section?: boolean }): Promise<Event> {
    const options: FindOneOptions = { relations: [] };
    if (joins && joins.section) { options.relations!.push('section'); }

    return Event.repository
      .findOneOrFail(id, options)
      .catch(() => Promise.reject('Event not found'));
  }

  public static find_all(joins?: { section?: boolean }): Promise<Event[]> {
    const options: FindManyOptions = { relations: [] };
    if (joins && joins.section) { options.relations!.push('section'); }

    return Event.repository.find(options);
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column('text') public message: string = '';
  @Column() public posted: boolean = false;
  @Column() public terminal_count: string = '';
  @ManyToOne(() => Section, property('events'), { nullable: false })
    public section: Promise<Section>;

  // tslint:disable-next-line member-ordering
  public static async new(fields: EventFieldsParams = {}): Promise<Event> {
    const event = new Event();

    assign(event, pick(fields, ['message', 'posted', 'terminal_count']));

    if (fields.section !== undefined) {
      event.section = Promise.resolve(await Section.find(fields.section));
    }

    return event;
  }

  public update(fields: EventFields = {}): this {
    return assign(this, pick(fields, ['message', 'posted', 'terminal_count']));
  }

  public delete(): Promise<DeleteResult> {
    return Event.repository.delete(this.id);
  }

  public save(): Promise<this> {
    return Event.repository.save(this);
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
