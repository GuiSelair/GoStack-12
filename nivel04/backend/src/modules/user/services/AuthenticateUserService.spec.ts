import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate an user', async () => {
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

  it('should not be able to authenticate an user that does not exist', async () => {
    expect(
      authenticateUserService.execute({
        email: 'johnDoe@example.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with incorrect password', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456789',
    });

    expect(
      authenticateUserService.execute({
        email: 'johnDoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
