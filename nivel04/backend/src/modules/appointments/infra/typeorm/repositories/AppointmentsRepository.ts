import { getRepository, Repository } from 'typeorm';

import IAppointmetsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmetsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointments = this.ormRepository.create({
      provider_id,
      date,
    });

    await this.ormRepository.save(appointments);
    return appointments;
  }
}

export default AppointmentsRepository;
