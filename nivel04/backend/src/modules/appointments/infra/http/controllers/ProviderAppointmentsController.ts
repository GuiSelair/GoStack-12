import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, month, year } = request.body;
    const provider_id = request.user.id;
    const llistProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );
    const appoinment = await llistProviderAppointments.execute({
      provider_id,
      day,
      month,
      year,
    });
    return response.json(appoinment);
  }
}
