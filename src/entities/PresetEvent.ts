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
  getManager,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Queryable from './Queryable';
// import { sockets as io_namespace } from '../sockets';

interface PresetEventFields {
  holds_clock?: boolean;
  message?: string;
  name?: string;
}

@Entity()
@Unique(['name'])
export default class PresetEvent implements PresetEventFields, Queryable {
  @once public static get repository() { return getManager().getRepository(PresetEvent); }

  public static async find(id: number): Promise<PresetEvent> {
    const preset_event = await PresetEvent.repository.findOne(id);

    if (preset_event === undefined) {
      throw new Error('Preset event not found');
    }
    return preset_event;
  }

  public static find_all(): Promise<PresetEvent[]> {
    return PresetEvent.repository.find();
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column() public holds_clock: boolean = false;
  @Column('text') public message: string = '';
  @Column() public name: string;

  constructor(fields: PresetEventFields = {}) {
    assign(this, pick(fields, ['holds_clock', 'message', 'name']));

    // by default, the name is equal to the message
    if (this.name === undefined) {
      this.name = this.message;
    }
  }

  public update(fields: PresetEventFields = {}): this {
    return assign(this, pick(fields, ['holds_clock', 'message', 'name']));
  }

  public delete(): Promise<DeleteResult> {
    return PresetEvent.repository.delete(this.id);
  }

  public save(): Promise<this> {
    return getManager()
      .getRepository(PresetEvent)
      .save(this);
  }

  // @AfterInsert() protected emit_insert() {
  //   io_namespace.preset_event.emit('insert', JSON.stringify(this));
  // }

  // @AfterUpdate() protected emit_update() {
  //   io_namespace.preset_event.emit('update', JSON.stringify(this));
  // }

  // @AfterRemove() protected emit_delete() {
  //   io_namespace.preset_event.emit('delete', JSON.stringify(this));
  // }
}
