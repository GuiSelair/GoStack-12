import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jonhDoe@email.com',
      name: 'Jonh Doe',
      password: 'one_password',
    });

    const showProfile = await showProfileService.execute(user.id);

    expect(showProfile.name).toBe('Jonh Doe');
    expect(showProfile.email).toBe('jonhDoe@email.com');
  });

  it('should not be able show the profile without not authenticated user', async () => {
    await expect(
      showProfileService.execute('non-authenticated-user'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
