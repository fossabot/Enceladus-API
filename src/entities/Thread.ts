import {
  // AfterInsert,
  // AfterRemove,
  // AfterUpdate,
  Column,
  DeleteResult,
  Entity,
  getManager,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Queryable } from './Queryable';
// import { sockets as io_namespace } from '../sockets';
import Section from './Section';
import User from './User';

interface ThreadFields {
  [key: string]: any;

  launch_name?: string;
  post_id?: string | null;
  subreddit?: string;
  t0?: number | null;
  take_number?: number;
  youtube_id?: string | null;
  spacex__api_id?: string | null;
}

@Entity()
export default class Thread implements ThreadFields, Queryable {
  [key: string]: any;

  public static async find(id: number): Promise<Thread> {
    const thread = await getManager().getRepository(Thread).findOne(id);

    if (thread === undefined) {
      return Promise.reject('Thread not found');
    }
    return Promise.resolve(thread);
  }

  public static find_all(): Promise<Thread[]> {
    return getManager().getRepository(Thread).find();
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column() public launch_name: string;
  @Column() public subreddit: string;
  @Column({ type: 'varchar', nullable: true }) public post_id: string | null;
  @Column({ type: 'integer', nullable: true }) public t0: number | null;
  @Column() public take_number: number = 1;
  @Column({ type: 'varchar', nullable: true }) public youtube_id: string | null;
  @OneToMany(() => Section, section => section.belongs_to_thread) public sections: Section[];
  @ManyToOne(() => User, user => user.threads_created) public created_by: User;
  @Column({ type: 'varchar', nullable: true }) public spacex__api_id: string | null;

  /**
   * We're unable to use a standard constructor,
   * as we need to return a Promise
   * (due to the possible undefined User)
   *
   * @constructor
   */
  public static new(fields: ThreadFields = {}) { // tslint:disable member-ordering
    return new Promise<Thread>((resolve, reject) => {
      const thread = new Thread();

      if (fields.created_by !== undefined) {
        User
        .find(fields.created_by)
        .then(created_by => {
          if (created_by === undefined) {
            reject('User not found');
          } else {
            thread.created_by = created_by;
          }
        }).catch(() => reject('User not found'));
      }

      [
        'launch_name',
        'post_id',
        'subreddit',
        't0',
        'take_number',
        'youtube_id',
        'spacex__api_id',
      ].forEach(field => {
        if (fields[field] !== undefined) {
          thread[field] = fields[field];
        }
      });

      resolve(thread);
    });
  }

  public update(fields: ThreadFields = {}): this {
    [
      'launch_name',
      't0',
      'take_number',
      'youtube_id',
      'spacex__api_id',
    ].forEach(field => {
      if (fields[field] !== undefined) {
        this[field] = fields[field];
      }
    });

    return this;
  }

  public delete(): Promise<DeleteResult> {
    return getManager().getRepository(Thread).delete(this);
  }

  public save(): Promise<this> {
    return getManager().getRepository(Thread).save(this);
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
