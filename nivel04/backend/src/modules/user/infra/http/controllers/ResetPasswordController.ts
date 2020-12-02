import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/user/services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, password_confirmation, token } = request.body;

    const sendForgotPasswordEmail = container.resolve(ResetPasswordService);

    await sendForgotPasswordEmail.execute({
      password,
      password_confirmation,
      token,
    });

    return response.status(204).json();
  }
}
