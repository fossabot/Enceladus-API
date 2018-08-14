import { DeleteResult } from 'typeorm';

export default interface Queryable {
  update(fields: object): this;
  delete(): Promise<DeleteResult>;
  save(): Promise<this>;
}
