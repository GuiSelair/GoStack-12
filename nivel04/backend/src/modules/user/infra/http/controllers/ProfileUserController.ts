import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/user/services/UpdateProfileService';
import ShowProfileService from '@modules/user/services/ShowProfileService';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, old_password } = request.body;
    const { id } = request.user;
    const updateProfile = container.resolve(UpdateProfileService);
    const updatedUser = await updateProfile.execute({
      user_id: id,
      name,
      email,
      password,
      old_password,
    });

    return response.status(200).json(classToClass(updatedUser));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const showProfileService = container.resolve(ShowProfileService);
    const profileUser = await showProfileService.execute(id);
    return response.status(200).json(classToClass(profileUser));
  }
}
