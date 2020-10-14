import 'reflect-metadata';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      email: 'jonhdoe@email.com',
      name: 'Jonh Doe',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'jonhdoe@email.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able unExisted user to recover the password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'jonhdoe@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be generate recover of token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const newUser = await fakeUsersRepository.create({
      email: 'jonhdoe@email.com',
      name: 'Jonh Doe',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'jonhdoe@email.com',
    });

    expect(generateToken).toHaveBeenCalledWith(newUser.id);
  });
});
