import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('UpdateUserAvatar', () => {
  it('should be update user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const userCreated = await fakeUsersRepository.create({
      email: 'jonhDoe@example.com',
      name: 'Jonh Doe',
      password: '123456',
    });

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const updatedAvatarUser = await updateUserAvatarService.execute({
      avatarFilename: 'avatar.png',
      user_id: userCreated.id,
    });

    expect(updatedAvatarUser.avatar).toBe('avatar.png');
  });

  it('should not be update user avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatarService.execute({
        avatarFilename: 'avatar.png',
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be delete user avatar existend before update', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const userCreated = await fakeUsersRepository.create({
      email: 'jonhDoe@example.com',
      name: 'Jonh Doe',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      avatarFilename: 'avatar.png',
      user_id: userCreated.id,
    });

    const newAvatar = await updateUserAvatarService.execute({
      avatarFilename: 'jonhDoe.jpg',
      user_id: userCreated.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(newAvatar.avatar).toBe('jonhDoe.jpg');
  });
});
