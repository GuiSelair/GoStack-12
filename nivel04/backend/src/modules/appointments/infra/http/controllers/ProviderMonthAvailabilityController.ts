import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { year, month } = request.body;
    const { provider_id } = request.params;
    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService,
    );
    const monthsAvailability = await listProviderMonthAvailability.execute({
      provider_id,
      month,
      year,
    });
    return response.json(monthsAvailability);
  }
}
