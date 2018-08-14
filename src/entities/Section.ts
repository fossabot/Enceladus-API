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
}

@Entity()
export default class Section implements SectionFields {
  public static async find(
    id: number,
    joins?: { lock?: boolean, thread?: boolean },
  ): Promise<Section> {
    const options: FindOneOptions = { relations: [] };
    if (joins && joins.lock) { options.relations!.push('lock_held_by'); }
    if (joins && joins.thread) { options.relations!.push('belongs_to_thread'); }

    const section = await getManager()
      .getRepository(Section)
      .findOne(id, options);

    if (section === undefined) {
      throw new Error('Section not found');
    }
    return section;
  }

  public static find_all(joins?: { lock?: boolean, thread?: boolean }): Promise<Section[]> {
    const options: FindManyOptions = { relations: [] };
    if (joins && joins.lock) { options.relations!.push('lock_held_by'); }
    if (joins && joins.thread) { options.relations!.push('belongs_to_thread'); }

    return getManager()
      .getRepository(Section)
      .find(options);
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column('text') public content: string = '';
  @Column() public name: string;
  @OneToMany(() => Event, event => event.belongs_to_section) public events: Event[];
  @ManyToOne(() => User, user => user.section_locks_held) public lock_held_by: User;
  @ManyToOne(() => Thread, thread => thread.sections) public belongs_to_thread: Thread;

  constructor(fields: SectionFields = {}) {
    assign(this, pick(fields, ['content', 'name']));
  }

  public update(fields: SectionFields = {}): this {
    return assign(this, pick(fields, ['content', 'name']));
  }

  public delete(): Promise<DeleteResult> {
    return getManager()
      .getRepository(Section)
      .delete(this.id);
  }

  public save(): Promise<this> {
    return getManager()
      .getRepository(Section)
      .save(this);
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
