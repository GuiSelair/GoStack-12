import 'reflect-metadata';

// import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list all appointments in day', async () => {
    const appointment01 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 8, 0, 0),
      provider_id: 'user',
      user_id: '212',
    });

    const appointment02 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 4, 20, 10, 0, 0),
      provider_id: 'user',
      user_id: '212',
    });

    const listAppointmentsInDay = await listProviderAppointmentsService.execute(
      {
        day: 20,
        month: 5,
        year: 2020,
        provider_id: 'user',
      },
    );

    expect(listAppointmentsInDay).toEqual([appointment01, appointment02]);
  });
});
