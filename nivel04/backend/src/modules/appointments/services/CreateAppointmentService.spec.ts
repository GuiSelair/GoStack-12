import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: '212',
      provider_id: '4556',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('4556');
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 14);

    await createAppointmentService.execute({
      date: appointmentDate,
      user_id: '212',
      provider_id: '4556',
    });

    expect(
      createAppointmentService.execute({
        date: new Date(),
        user_id: '212',
        provider_id: '4566',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'user_provider',
        user_id: 'user_customer',
        date: new Date(2020, 4, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'user_provider',
        user_id: 'user_provider',
        date: new Date(2020, 4, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments after 17h or before 8h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 6).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'user_provider',
        user_id: 'user_customer',
        date: new Date(2020, 4, 10, 19),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        provider_id: 'user_provider',
        user_id: 'user_customer',
        date: new Date(2020, 4, 10, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
