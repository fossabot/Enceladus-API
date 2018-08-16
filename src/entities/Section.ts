import once from 'lodash-decorators/once';
import assign from 'lodash/assign';
import pick from 'lodash/pick';
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
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { sockets as io_namespace } from '../sockets';
import Event from './Event';
import Thread from './Thread';
import User from './User';

interface SectionFields {
  content?: string;
  name?: string;
  events?: Event[];
  lock_held_by?: Promise<User>;
  belongs_to_thread?: Promise<Thread>;
}

interface SectionFieldsParams {
  content?: string;
  name?: string;
  events?: string; // number[] concatenated by commas
  lock?: number;
  thread?: number;
}

@Entity()
export default class Section implements SectionFields {
  @once public static get repository() { return getManager().getRepository(Section); }

  public static async find(
    id: number,
    joins?: { lock?: boolean, thread?: boolean },
  ): Promise<Section> {
    const options: FindOneOptions = { relations: [] };
    if (joins && joins.lock) { options.relations!.push('lock_held_by'); }
    if (joins && joins.thread) { options.relations!.push('belongs_to_thread'); }

    const section = await Section.repository.findOne(id, options);

    if (section === undefined) {
      throw new Error('Section not found');
    }
    return section;
  }

  public static find_all(joins?: { lock?: boolean, thread?: boolean }): Promise<Section[]> {
    const options: FindManyOptions = { relations: [] };
    if (joins && joins.lock) { options.relations!.push('lock_held_by'); }
    if (joins && joins.thread) { options.relations!.push('belongs_to_thread'); }

    return Section.repository.find(options);
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column('text') public content: string = '';
  @Column() public name: string;
  @OneToMany(() => Event, event => event.belongs_to_section, { nullable: false, eager: true })
    public events: Event[];
  @ManyToOne(() => User, user => user.section_locks_held) public lock_held_by: Promise<User>;
  @ManyToOne(() => Thread, thread => thread.sections, { nullable: false })
    public belongs_to_thread: Promise<Thread>;

  // tslint:disable-next-line member-ordering
  public static async new(fields: SectionFieldsParams = {}): Promise<Section> {
    const section = new Section();

    assign(section, pick(fields, ['content', 'name']));

    if (fields.thread !== undefined) {
      section.belongs_to_thread = Promise.resolve(await Thread.find(fields.thread));
    }

    return section;
  }

  public async update(fields: SectionFieldsParams = {}): Promise<this> {
    assign(this, pick(fields, ['content', 'name']));

    if (fields.lock !== undefined) {
      this.lock_held_by = User.find(fields.lock);
    }

    if (fields.events !== undefined) {
      const events = fields.events.split(',').map(n => parseInt(n, 10));
      this.events = await Promise.all(events.map($ => Event.find($)));
    }

    return this;
  }

  public delete(): Promise<DeleteResult> {
    return Section.repository.delete(this.id);
  }

  public save(): Promise<this> {
    return Section.repository.save(this);
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
