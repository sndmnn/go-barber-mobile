import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersList,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  providerId: string;
}

interface DayAvailability {
  hour: number;
  isAvailable: boolean;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

export interface HourProps {
  isAvailable: boolean;
  isSelected: boolean;
}

export interface HourTextProps {
  isSelected: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { providerId } = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedHour, setSelectedHour] = useState(0);

  const [dayAvailability, setDayAvailability] = useState<DayAvailability[]>([]);

  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();

  const morningAvailability = useMemo(() => {
    return dayAvailability
      .filter(day => day.hour <= 12)
      .map(({ hour, isAvailable }) => ({
        hour,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
        isAvailable,
      }));
  }, [dayAvailability]);

  const afternoonAvailability = useMemo(() => {
    return dayAvailability
      .filter(day => day.hour > 12)
      .map(({ hour, isAvailable }) => ({
        hour,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
        isAvailable,
      }));
  }, [dayAvailability]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback(selectedProviderId => {
    setSelectedProvider(selectedProviderId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('/appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert(
        'Erro ao criar o agendamento',
        'Ocorreu um erro ao tentar criar um agendamento, tente novamente',
      );
    }
  }, [selectedDate, selectedHour, selectedProvider, navigate]);

  useEffect(() => {
    api.get('/providers').then(
      response => setProviders(response.data),
      reason => {
        console.log(reason);
      },
    );
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(
        response => setDayAvailability(response.data),
        reason => {
          console.log(reason);
        },
      );
  }, [selectedDate, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleileiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => {
                  handleSelectProvider(provider.id);
                }}
                selected={provider.id === selectedProvider}
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

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              value={selectedDate}
              onChange={handleDateChange}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(
                ({ hour, formattedHour, isAvailable }) => (
                  <Hour
                    key={formattedHour}
                    enabled={isAvailable}
                    isAvailable={isAvailable}
                    isSelected={selectedHour === hour}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText isSelected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ hour, formattedHour, isAvailable }) => (
                  <Hour
                    key={formattedHour}
                    enabled={isAvailable}
                    isAvailable={isAvailable}
                    isSelected={selectedHour === hour}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText isSelected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
