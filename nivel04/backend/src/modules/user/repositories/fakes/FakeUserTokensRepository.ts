import { uuid } from 'uuidv4';

import IUserTokenRepository from '@modules/user/repositories/IUserTokenRepository';
import UserToken from '@modules/user/infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokenRepository {
  private usersToken: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.usersToken.push(userToken);

    return userToken;
  }
}

export default FakeUserTokensRepository;
