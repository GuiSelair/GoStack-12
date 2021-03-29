import React, { useCallback, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';
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

interface ForgotFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um email válido')
            .required('Email obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          title: 'Email de recuperação enviado',
          description:
            'Enviamos um emaill para confirmar a recuperação de senha. Verifique seu email.',
          type: 'success',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        if (error instanceof Yup.ValidationError) {
          const errors = validationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );
  return (
    <Container>
      <Content>
        <AnimationContent>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>
            <Input
              name="email"
              icon={FiMail}
              type="email"
              placeholder="E-mail"
            />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/signup">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContent>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
