import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;
    const createAppointment = container.resolve(CreateAppointmentService);
    const appoinment = await createAppointment.execute({
      provider_id,
      user_id,
      date,
    });
    return response.json(appoinment);
  }
}
