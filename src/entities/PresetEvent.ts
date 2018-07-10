import {
  /* AfterInsert, AfterRemove, AfterUpdate,*/ Column, Entity, PrimaryGeneratedColumn, Unique,
} from 'typeorm';
// import { sockets as io_namespace } from '../sockets';

interface PresetEventFields {
  holds_clock?: boolean;
  message?: string;
  name?: string;
}

@Entity()
@Unique(['name'])
export default class PresetEvent implements PresetEventFields {
  @PrimaryGeneratedColumn() public id: number;
  @Column() public holds_clock: boolean = false;
  @Column('text') public message: string = '';
  @Column() public name: string;

  constructor(fields: PresetEventFields = {}) {
    const { holds_clock, message, name }: PresetEventFields = fields;

    if (holds_clock !== undefined) { this.holds_clock = holds_clock; }
    if (message !== undefined) { this.message = message; }
    if (name !== undefined) { this.name = name; }

    // by default, the name is equal to the message
    if (this.name === undefined) {
      this.name = this.message;
    }
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
