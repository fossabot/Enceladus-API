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
import { Queryable } from './Queryable';
// import { sockets as io_namespace } from '../sockets';

interface PresetEventFields {
  [key: string]: any;

  holds_clock?: boolean;
  message?: string;
  name?: string;
}

@Entity()
@Unique(['name'])
export default class PresetEvent implements PresetEventFields, Queryable {
  [key: string]: any;

  public static async find(id: number): Promise<PresetEvent> {
    const preset_event = await getManager()
      .getRepository(PresetEvent)
      .findOne(id);

    if (preset_event === undefined) {
      return Promise.reject('Preset event not found');
    }
    return Promise.resolve(preset_event);
  }

  public static find_all(): Promise<PresetEvent[]> {
    return getManager()
      .getRepository(PresetEvent)
      .find();
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
    return getManager()
      .getRepository(PresetEvent)
      .delete(this);
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
