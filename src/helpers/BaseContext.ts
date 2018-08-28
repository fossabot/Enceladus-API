import { BaseContext } from 'koa';
import { User } from '../entities/User';

export type BaseContext = BaseContext & {
  params: any;
  request: any;
  state: {
    jwt?: { user: string };
    user_data?: User;
  };
};
