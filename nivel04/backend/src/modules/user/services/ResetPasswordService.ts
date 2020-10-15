import { inject, injectable } from 'tsyringe';

// import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import IUserTokenRepository from '@modules/user/repositories/IUserTokenRepository';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  private usersRepository: IUsersRepository;

  private usersTokenRepository: IUserTokenRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('UserTokens')
    userTokensRepository: IUserTokenRepository,
  ) {
    this.usersRepository = usersRepository;
    this.usersTokenRepository = userTokensRepository;
  }

  public async execute({ password, token }: IRequestDTO): Promise<void> {
    const userToken = await this.usersTokenRepository.findByToken(token);

    if (!userToken) throw new AppError('User token does not exist');

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('User does not exist');

    user.password = password;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
