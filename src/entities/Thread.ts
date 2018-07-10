import {
  /* AfterInsert, AfterRemove, AfterUpdate,*/ Column, Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { sockets as io_namespace } from '../sockets';
import Section from './Section';
import User from './User';

interface ThreadFields {
  launch_name?: string;
  subreddit?: string;
  t0?: number | null;
  take_number?: number;
  youtube_id?: string | null;
  spacex__api_id?: string | null;
}

@Entity()
export default class Thread implements ThreadFields {
  @PrimaryGeneratedColumn() public id: number;
  @Column() public launch_name: string;
  @Column() public subreddit: string;
  @Column({ type: 'integer', nullable: true }) public t0: number | null;
  @Column() public take_number: number = 1;
  @Column({ type: 'varchar', nullable: true }) public youtube_id: string | null;
  @OneToMany(() => Section, section => section.belongs_to_thread) public sections: Section[];
  @ManyToOne(() => User, user => user.threads_created) public created_by: User;
  @Column({ type: 'varchar', nullable: true }) public spacex__api_id: string | null;

  constructor(fields: ThreadFields = {}) {
    const {
      launch_name,
      subreddit,
      t0,
      take_number,
      youtube_id,
      spacex__api_id,
    }: ThreadFields = fields;

    if (launch_name !== undefined) { this.launch_name = launch_name; }
    if (subreddit !== undefined) { this.subreddit = subreddit; }
    if (t0 !== undefined) { this.t0 = t0; }
    if (take_number !== undefined) { this.take_number = take_number; }
    if (youtube_id !== undefined) { this.youtube_id = youtube_id; }
    if (spacex__api_id !== undefined) { this.spacex__api_id = spacex__api_id; }
  }

  // @AfterInsert() protected emit_insert() {
  //   io_namespace.thread.emit('insert', JSON.stringify(this));
  // }

  // @AfterUpdate() protected emit_update() {
  //   io_namespace.thread.emit('update', JSON.stringify(this));
  // }

  // @AfterRemove() protected emit_delete() {
  //   io_namespace.thread.emit('delete', JSON.stringify(this));
  // }
}
