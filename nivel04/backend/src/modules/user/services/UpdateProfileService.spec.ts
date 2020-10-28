import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/user/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jonhDoe@email.com',
      name: 'Jonh Doe',
      password: 'one_password',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jonh Doe Doi',
      email: 'jonhDoi@email.com',
    });

    expect(updatedUser.name).toBe('Jonh Doe Doi');
    expect(updatedUser.email).toBe('jonhDoi@email.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      email: 'jonhDoe@email.com',
      name: 'Jonh Doe',
      password: 'one_password',
    });

    const user = await fakeUsersRepository.create({
      email: 'jonhDoi@email.com',
      name: 'Jonh Doe 2',
      password: 'one_password2',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jonh Doe Doi',
        email: 'jonhDoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update to profile if non-existed user', async () => {
    await expect(
      updateProfileService.execute({
        email: 'jonhDoe@email.com',
        name: 'Jonh Doe',
        user_id: 'non-existed-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jonhDoe@email.com',
      name: 'Jonh Doe',
      password: 'one_password',
    });

    const updatedUserPassword = await updateProfileService.execute({
      user_id: user.id,
      email: 'jonhDoe@email.com',
      name: 'Jonh Doe',
      password: 'new_password',
      old_password: 'one_password',
    });

    expect(updatedUserPassword.password).toBe('new_password');
  });

  it('should not be able to update the password if old password not used', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jonhDoe@email.com',
      name: 'Jonh Doe',
      password: 'one_password',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'jonhDoe@email.com',
        name: 'Jonh Doe',
        password: 'new_password',
        old_password: 'wrong_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password if old password not informated', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jonhDoe@email.com',
      name: 'Jonh Doe',
      password: 'one_password',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'jonhDoe@email.com',
        name: 'Jonh Doe',
        password: 'new_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
