import { Router } from 'express';
import { uuid } from 'uuidv4';
import { startOfHour, parseISO, isEqual } from 'date-fns';

const appointmentsRouter = Router();

interface Appointment {
    id: string;
    provider: string;
    date: Date;
}

const appointments: Appointment[] = [];

appointmentsRouter.post('/', (request, response) => {
    const { provider, date } = request.body;
    const parsedDate = startOfHour(parseISO(date));

    // CÓDIGO ABAIXO RESPONSAVEL POR VERIFICAR SE JÁ EXISTE A DATA PASSADA DENTRO DO ARRAY
    const findAppointmentInSameDate = appointments.find(appointment =>
        isEqual(parsedDate, appointment.date),
    );

    if (findAppointmentInSameDate) {
        return response
            .status(400)
            .json({ message: 'This appointment is already booked' });
    }

    const appoinment = {
        id: uuid(),
        provider,
        date: parsedDate,
    };
    appointments.push(appoinment);
    return response.json(appoinment);
});

export default appointmentsRouter;
