import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear } from 'date-fns';

import IAppointmetsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllInMonthFromProvider from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmetsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );
    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    month,
    year,
    provider_id,
  }: IFindAllInMonthFromProvider): Promise<Appointment[]> {
    const appointmentsFromProvider = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );
    return appointmentsFromProvider;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointments = new Appointment();

    Object.assign(appointments, { id: uuid(), date, provider_id });
    this.appointments.push(appointments);

    return appointments;
  }
}

export default AppointmentsRepository;
