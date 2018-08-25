import { BaseContext } from 'koa';
export type BaseContext = BaseContext & {
  params: any;
  request: any;
  state: {
    jwt?: { user: string };
    user_data?: {
      id: number;
      is_global_admin: boolean;
      spacex__is_admin: boolean;
      spacex__is_mod: boolean;
      spacex__is_slack_member: boolean;
      username: string;
    };
  };
};
