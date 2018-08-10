import { DeleteResult } from 'typeorm';

export interface Queryable {
  // find_all(): any; // : Promise<Queryable[]>;
  // find(id: number): Promise<Queryable>;
  update(fields: object): this;
  delete(): Promise<DeleteResult>;
  save(): Promise<this>;
}
