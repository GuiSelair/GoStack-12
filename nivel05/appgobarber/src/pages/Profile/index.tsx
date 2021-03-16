import React, { useCallback, useEffect, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import validationsErrors from '../../Utils/getValidationErrors';

interface FormDataProps {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  old_password: string;
}

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const { user, updatedUser } = useAuth();
  const emailELRef = useRef<TextInput>(null);
  const oldPasswordELRef = useRef<TextInput>(null);
  const newPasswordELRef = useRef<TextInput>(null);
  const confirmationPasswordELRef = useRef<TextInput>(null);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleSubmit = useCallback(
    async (data: FormDataProps) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), undefined],
              'Confirmação de senha incorreta...',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          password,
          old_password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('profile', formData);
        updatedUser(response.data);

        Alert.alert('Perfil atualizado com sucesso');

        navigation.goBack();
      } catch (error) {
        console.log(error);
        if (error instanceof Yup.ValidationError) {
          const errors = validationsErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro ao atualização do perfil',
          'Ocorreu um erro ao atualizar perfil, tente novamente.',
        );
      }
    },
    [navigation, updatedUser],
  );

  const handleUpdateAvatar = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      response => {
        if (response.didCancel) {
          console.log('Usuário cancelou');
        } else if (response.errorCode) {
          console.log(response.errorCode);
        } else {
          const source = { uri: response.uri };
          console.log(source);
        }
      },
    );
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={navigation.goBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>
            <Form onSubmit={handleSubmit} ref={formRef} initialData={user}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailELRef.current?.focus();
                }}
              />
              <Input
                ref={emailELRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordELRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordELRef}
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                textContentType="newPassword"
                secureTextEntry
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => {
                  newPasswordELRef.current?.focus();
                }}
              />
              <Input
                ref={newPasswordELRef}
                name="password"
                icon="lock"
                placeholder="Nova senha"
                textContentType="newPassword"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmationPasswordELRef.current?.focus();
                }}
              />
              <Input
                ref={confirmationPasswordELRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirme sua senha"
                textContentType="newPassword"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
