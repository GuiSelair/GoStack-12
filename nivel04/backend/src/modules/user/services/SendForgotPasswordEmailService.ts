import { inject, injectable } from 'tsyringe';

// import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import IUserTokenRepository from '@modules/user/repositories/IUserTokenRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;

  private usersTokenRepository: IUserTokenRepository;

  private mailProvider: IMailProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('MailProvider')
    mailProvider: IMailProvider,

    @inject('UserTokens')
    userTokensRepository: IUserTokenRepository,
  ) {
    this.usersRepository = usersRepository;
    this.mailProvider = mailProvider;
    this.usersTokenRepository = userTokensRepository;
  }

  public async execute({ email }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user)
      throw new AppError('Impossible to recover password of unRegisted user');

    this.usersTokenRepository.generate(user.id);
    this.mailProvider.sendMail(user.email, 'TESTE DE ENVIO');
  }
}

export default SendForgotPasswordEmailService;
