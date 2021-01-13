import React, { useCallback, useRef } from 'react';
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

import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import validationsErrors from '../../Utils/getValidationErrors';
import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInText,
  BackToSignInIcon,
} from './styles';

interface FormDataProps {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailELRef = useRef<TextInput>(null);
  const passwordELRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (data: FormDataProps) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          password: Yup.string().min(6, 'No minimo 6 digitos'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('users', data);

        Alert.alert(
          'Cadastro realizado com sucesso',
          'Você já pode fazer login na aplicação',
        );

        navigation.goBack();
      } catch (error) {
        console.log(error);
        if (error instanceof Yup.ValidationError) {
          const errors = validationsErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro ao Cadastrar',
          'Ocorreu um erro ao fazer cadastro, tente novamente.',
        );
      }
    },
    [navigation],
  );

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
            <Image source={logoImg} />
            <View>
              <Title>Faça seu Cadastro</Title>
            </View>
            <Form onSubmit={handleSubmit} ref={formRef}>
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
                  passwordELRef.current?.focus();
                }}
              />
              <Input
                ref={passwordELRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignInButton onPress={() => navigation.goBack()}>
        <BackToSignInIcon name="arrow-left" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignInButton>
    </>
  );
};

export default SignUp;
