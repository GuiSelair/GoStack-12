import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { year, month, day } = request.query;
    const { provider_id } = request.params;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );
    const daysAvailability = await listProviderDayAvailability.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });
    return response.json(daysAvailability);
  }
}
