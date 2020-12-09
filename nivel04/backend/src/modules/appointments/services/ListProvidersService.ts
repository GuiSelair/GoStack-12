import { inject, injectable } from 'tsyringe';

import User from '@modules/user/infra/typeorm/entities/User';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class ListProvidersService {
  private usersRepository: IUsersRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute(user_id: string): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `provider-list:${user_id}`,
    );

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(`provider-list:${user_id}`, users);
    }

    return users;
  }
}

export default ListProvidersService;
