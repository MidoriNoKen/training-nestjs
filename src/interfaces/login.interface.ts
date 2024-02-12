import { User } from 'modules/user/entities/user.entity';

export interface LoginInterface {
  user: User;
  accessToken: string;
  refreshToken: string;
}
