import React, { useCallback, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import { Container, Content, Background, AnimationContent } from './styles';
import logo from '../../assets/logo.svg';
import validationErrors from '../../Utils/getValidationErrors';
import api from '../../services/api';

interface ResetFormData {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória...'),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Confirmação de senha incorreta...',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (!queryParams.has('token')) throw new Error();

        await api.post('password/reset', {
          password: data.password,
          password_confirmation: data.passwordConfirmation,
          token: queryParams.get('token'),
        });

        history.push('/');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        if (error instanceof Yup.ValidationError) {
          const errors = validationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          title: 'Erro na Autenticação',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
          type: 'error',
        });
      }
    },
    [addToast, history, queryParams],
  );
  return (
    <Container>
      <Content>
        <AnimationContent>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Crie sua nova senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="passwordConfirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirma sua nova senha"
            />
            <Button type="submit">Alterar</Button>
          </Form>
        </AnimationContent>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
