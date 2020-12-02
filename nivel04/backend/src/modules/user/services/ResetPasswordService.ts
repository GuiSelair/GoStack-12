import { inject, injectable } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';

// import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import IUserTokenRepository from '@modules/user/repositories/IUserTokenRepository';
import IHashProvider from '@modules/user/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  token: string;
  password: string;
  password_confirmation: string;
}

@injectable()
class ResetPasswordService {
  private usersRepository: IUsersRepository;

  private usersTokenRepository: IUserTokenRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    userTokensRepository: IUserTokenRepository,

    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.usersTokenRepository = userTokensRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    password,
    password_confirmation,
    token,
  }: IRequestDTO): Promise<void> {
    const userToken = await this.usersTokenRepository.findByToken(token);

    if (!userToken) throw new AppError('User token does not exist');

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('User does not exist');

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token Expired.');
    }

    if (password !== password_confirmation) {
      throw new AppError('Passwords have been equals.');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
