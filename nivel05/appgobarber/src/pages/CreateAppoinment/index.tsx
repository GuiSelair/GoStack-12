import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
} from './styles';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface IRouteParams {
  providerId: string;
}

export interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

interface IAvailability {
  hour: number;
  available: boolean;
}

const CreateAppoinment: React.FC = () => {
  const [providers, setProviders] = useState<IProvider[]>([]);
  const route = useRoute();
  const routeParams = route.params as IRouteParams;
  const { goBack } = useNavigation();
  const { user } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<IAvailability[]>([]);

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, [user]);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const toggleDateTimePicker = useCallback(() => {
    setShowDatePicker(old => !old);
  }, []);

  const handleDateTimePickerChange = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        toggleDateTimePicker();
      }

      if (date) {
        setSelectedDate(date);
      }
    },
    [toggleDateTimePicker],
  );

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={32} color="#f5ede8" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              selected={provider.id === selectedProvider}
              onPress={() => handleSelectProvider(provider.id)}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>

      <Calendar>
        <Title>Escolha a data</Title>

        <OpenDatePickerButton onPress={toggleDateTimePicker}>
          <OpenDatePickerButtonText>
            Selecionar outra data
          </OpenDatePickerButtonText>
        </OpenDatePickerButton>

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            display="calendar"
            value={selectedDate}
            onChange={handleDateTimePickerChange}
          />
        )}
      </Calendar>
    </Container>
  );
};

export default CreateAppoinment;
