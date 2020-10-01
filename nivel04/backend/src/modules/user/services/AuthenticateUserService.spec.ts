import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to authenticate an user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456789',
    });

    const response = await authenticateUserService.execute({
      email: 'johnDoe@example.com',
      password: '123456789',
    });

    expect(response).toHaveProperty('token');
  });

  // it('should not be able to authenticate an user that does not exist', async () => {
  //   const fakeUsersRepository = new FakeUsersRepository();
  //   const fakeHashProvider = new FakeHashProvider();

  //   const authenticateUserService = new AuthenticateUserService(
  //     fakeUsersRepository,
  //     fakeHashProvider,
  //   );

  //   // const response = await authenticateUserService.execute({
  //   //   email: 'johnDoe@example.com',
  //   //   password: '123456789',
  //   // });

  //   expect(
  //     await authenticateUserService.execute({
  //       email: 'johnDoe@example.com',
  //       password: '123456789',
  //     }),
  //   ).rejects.toBeInstanceOf(AppError);
  // });

  // it('should not be able to authenticate an user with incorrect password', async () => {
  //   const fakeUsersRepository = new FakeUsersRepository();
  //   const fakeHashProvider = new FakeHashProvider();

  //   const createUserService = new CreateUserService(
  //     fakeUsersRepository,
  //     fakeHashProvider,
  //   );
  //   const authenticateUserService = new AuthenticateUserService(
  //     fakeUsersRepository,
  //     fakeHashProvider,
  //   );

  //   await createUserService.execute({
  //     name: 'John Doe',
  //     email: 'johnDoe@example.com',
  //     password: '123456789',
  //   });

  //   const response = await authenticateUserService.execute({
  //     email: 'johnDoe@example.com',
  //     password: '123456',
  //   });

  //   expect(response).rejects.toBeInstanceOf(AppError);
  // });
});
