import 'reflect-metadata';

// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able list all providers less authenticated user', async () => {
    const user01 = await fakeUsersRepository.create({
      name: 'Teste01',
      email: 'teste01@email.com',
      password: '123456',
    });
    const user02 = await fakeUsersRepository.create({
      name: 'Teste02',
      email: 'teste02@email.com',
      password: '123456',
    });
    const loggedUser = await fakeUsersRepository.create({
      name: 'Teste03',
      email: 'teste03@email.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute(loggedUser.id);

    expect(providers).toEqual([user01, user02]);
  });
});
