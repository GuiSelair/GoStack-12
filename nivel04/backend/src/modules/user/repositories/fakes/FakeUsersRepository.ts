import { uuid } from 'uuidv4';

import IUserRepository from '@modules/user/repositories/IUsersRepository';
import ICreateUser from '@modules/user/dtos/ICreateUserDTO';

import User from '@modules/user/infra/typeorm/entities/User';

class UsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  public async create({ email, name, password }: ICreateUser): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, { id: uuid(), email, name, password });
    this.users.push(newUser);
    return newUser;
  }

  public async save(user: User): Promise<User> {
    const existedUserIndex = this.users.findIndex(
      registerUser => registerUser.id === user.id,
    );

    this.users[existedUserIndex] = user;

    return user;
  }
}

export default UsersRepository;
