import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      email: 'guilherme.lima1997@hotmail.com',
      name: 'Guilherme Selair',
      password: '12346789',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Guilherme Selair');
    expect(user.email).toBe('guilherme.lima1997@hotmail.com');
  });

  it('should not be able to create a new user with an email existed', async () => {
    await createUserService.execute({
      email: 'guilherme.lima1997@hotmail.com',
      name: 'Guilherme Selair',
      password: '12346789',
    });

    expect(
      createUserService.execute({
        email: 'guilherme.lima1997@hotmail.com',
        name: 'Guilherme Selair',
        password: '12346789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
