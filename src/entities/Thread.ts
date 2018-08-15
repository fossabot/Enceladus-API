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
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Queryable from './Queryable';
import Section from './Section';
import User from './User';
// import { sockets as io_namespace } from '../sockets';

interface ThreadFields {
  [key: string]: unknown;

  launch_name?: string;
  post_id?: string | null;
  subreddit?: string;
  t0?: number | null;
  take_number?: number;
  youtube_id?: string | null;
  spacex__api_id?: string | null;
  created_by?: Promise<User>;
  sections?: Promise<Section[]>;
}

@Entity()
export default class Thread implements ThreadFields, Queryable {
  @once public static get repository() { return getManager().getRepository(Thread); }

  public static async find(
    id: number,
    joins?: { user?: boolean, sections?: boolean },
  ): Promise<Thread> {
    const options: FindOneOptions = { relations: [] };
    if (joins && joins.user) { options.relations!.push('created_by'); }
    if (joins && joins.sections) { options.relations!.push('sections'); }

    const thread = await Thread.repository.findOne(id, options);

    if (thread === undefined) {
      throw new Error('Thread not found');
    }
    return thread;
  }

  public static find_all(joins?: { user?: boolean, sections?: boolean }): Promise<Thread[]> {
    const options: FindManyOptions = { relations: [] };
    if (joins && joins.user) { options.relations!.push('created_by'); }
    if (joins && joins.sections) { options.relations!.push('sections'); }

    return Thread.repository.find(options);
  }

  @PrimaryGeneratedColumn() public id: number;
  @Column() public launch_name: string;
  @Column() public subreddit: string;
  @Column({ type: 'varchar', nullable: true }) public post_id: string | null;
  @Column({ type: 'integer', nullable: true }) public t0: number | null;
  @Column() public take_number: number = 1;
  @Column({ type: 'varchar', nullable: true }) public youtube_id: string | null;
  @OneToMany(() => Section, property('belongs_to_thread')) public sections: Promise<Section[]>;
  @ManyToOne(() => User, property('threads_created')) public created_by: Promise<User>;
  @Column({ type: 'varchar', nullable: true }) public spacex__api_id: string | null;

  /**
   * We're unable to use a standard constructor,
   * as we need to return a Promise
   * (due to the possible undefined User)
   *
   * @constructor
   */
  // tslint:disable-next-line member-ordering
  public static async new(fields: ThreadFields = {}): Promise<Thread> {
      const thread = new Thread();

      if (fields.created_by !== undefined) {
        const user = await User.find((await fields.created_by).id);

        if (user === undefined) {
          throw new Error('User not found');
        } else {
          thread.created_by = Promise.resolve(user);
        }
      }

      return assign(
        thread,
        pick(fields, [
          'launch_name',
          'post_id',
          'subreddit',
          't0',
          'take_number',
          'youtube_id',
          'spacex__api_id',
        ]),
      );
  }

  public update(fields: ThreadFields = {}): this {
    return assign(
      this,
      pick(fields, ['launch_name', 't0', 'take_number', 'youtube_id', 'spacex__api_id']),
    );
  }

  public delete(): Promise<DeleteResult> {
    return Thread.repository.delete(this.id);
  }

  public save(): Promise<this> {
    return Thread.repository.save(this);
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
