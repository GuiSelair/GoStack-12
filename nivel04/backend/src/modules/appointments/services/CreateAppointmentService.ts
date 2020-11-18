import { startOfHour, isBefore, getHours } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You cant create a appointment on a past date');
    }

    if (provider_id === user_id)
      throw new AppError('You cant create a appointment with yourself');

    const appointmentHour = getHours(appointmentDate);
    if (appointmentHour < 8 || appointmentHour > 17)
      throw new AppError(
        'You cant create a appointment a non-business schedule',
      );

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appoinment = this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appoinment;
  }
}

export default CreateAppointmentService;
