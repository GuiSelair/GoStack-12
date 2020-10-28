import { inject, injectable } from 'tsyringe';

import User from '@modules/user/infra/typeorm/entities/User';
// import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import IHashProvider from '@modules/user/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    const userWithUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id)
      throw new AppError('Email already use.');

    user.email = email;
    user.name = name;

    if (password) {
      if (!old_password) throw new AppError('Old password is required');

      const isEqualPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!isEqualPassword)
        throw new AppError('Old password is not equal a current password');

      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
