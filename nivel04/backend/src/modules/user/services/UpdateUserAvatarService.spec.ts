import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be update user avatar', async () => {
    const userCreated = await fakeUsersRepository.create({
      email: 'jonhDoe@example.com',
      name: 'Jonh Doe',
      password: '123456',
    });

    const updatedAvatarUser = await updateUserAvatarService.execute({
      avatarFilename: 'avatar.png',
      user_id: userCreated.id,
    });

    expect(updatedAvatarUser.avatar).toBe('avatar.png');
  });

  it('should not be update user avatar from non existing user', async () => {
    expect(
      updateUserAvatarService.execute({
        avatarFilename: 'avatar.png',
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be delete user avatar existend before update', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
