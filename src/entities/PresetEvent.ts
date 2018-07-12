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
// import { sockets as io_namespace } from '../sockets';

interface PresetEventFields {
  [key: string]: any;

  holds_clock?: boolean;
  message?: string;
  name?: string;
}

@Entity()
@Unique(['name'])
export default class PresetEvent implements PresetEventFields {
  [key: string]: any;

  public static async exists(id: number): Promise<boolean> {
    return await PresetEvent.find(id) !== undefined;
  }

  public static find(id: number): Promise<Option<PresetEvent>> {
    return getManager().getRepository(PresetEvent).findOne(id);
  }

  public static find_all(): Promise<PresetEvent[]> {
    return getManager().getRepository(PresetEvent).find();
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column() public holds_clock: boolean = false;
  @Column('text') public message: string = '';
  @Column() public name: string;

  constructor(fields: PresetEventFields = {}) {
    const { holds_clock, message, name }: PresetEventFields = fields;

    [
      'holds_clock',
      'message',
      'name',
    ].forEach(field => {
      if (fields[field] !== undefined) {
        this[field] = fields[field];
      }
    });
    if (holds_clock !== undefined) { this.holds_clock = holds_clock; }
    if (message !== undefined) { this.message = message; }
    if (name !== undefined) { this.name = name; }

    // by default, the name is equal to the message
    if (this.name === undefined) {
      this.name = this.message;
    }
  }

  public update(fields: PresetEventFields = {}): this {
    [
      'holds_clock',
      'message',
      'name',
    ].forEach(field => {
      if (fields[field] !== undefined) {
        this[field] = fields[field];
      }
    });

    return this;
  }

  public delete(): Promise<DeleteResult> {
    return getManager().getRepository(PresetEvent).delete(this);
  }

  public save(): Promise<this> {
    return getManager().getRepository(PresetEvent).save(this);
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
