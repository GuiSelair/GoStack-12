import { uuid } from 'uuidv4';

import IUserTokenRepository from '@modules/user/repositories/IUserTokenRepository';
import UserToken from '@modules/user/infra/typeorm/entities/UserToken';
import AppError from '@shared/errors/AppError';

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

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.usersToken.find(
      reset_token => reset_token.token === token,
    );

    return userToken;
  }
}

export default FakeUserTokensRepository;
