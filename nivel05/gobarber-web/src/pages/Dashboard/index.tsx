import React, { useCallback, useState } from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { useAuth } from '../../hooks/auth';
import logoImg from '../../assets/logo.svg';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Calendar,
  Schedule,
  Content,
  NextAppointments,
  Session,
  Appointment,
} from './styles';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Logo GoBarber" />

          <Profile>
            <img
              src={
                user.avatar_url
                  ? user.avatar_url
                  : 'https://www.flaticon.com/svg/static/icons/svg/180/180677.svg'
              }
              alt={user.name}
            />

            <div>
              <span>Bem-vindo, </span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horarios agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>

          <NextAppointments>
            <h3>Atendimento a seguir</h3>
            <div>
              <img
                src="https://www.flaticon.com/svg/static/icons/svg/180/180677.svg"
                alt="Usuário"
              />
              <strong>Guilherme Selair</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointments>

          <Session>
            <strong>Manhã</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://www.flaticon.com/svg/static/icons/svg/180/180677.svg"
                  alt="Usuário"
                />
                <strong>Guilherme Selair</strong>
              </div>
            </Appointment>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://www.flaticon.com/svg/static/icons/svg/180/180677.svg"
                  alt="Usuário"
                />
                <strong>Guilherme Selair</strong>
              </div>
            </Appointment>
          </Session>

          <Session>
            <strong>Tarde</strong>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://www.flaticon.com/svg/static/icons/svg/180/180677.svg"
                  alt="Usuário"
                />
                <strong>Guilherme Selair</strong>
              </div>
            </Appointment>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img
                  src="https://www.flaticon.com/svg/static/icons/svg/180/180677.svg"
                  alt="Usuário"
                />
                <strong>Guilherme Selair</strong>
              </div>
            </Appointment>
          </Session>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
