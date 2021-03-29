import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiUser, FiLock, FiCamera } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import validationsErrors from '../../Utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import { Container, Content, ProfileImage } from './styles';

interface FormaDataProps {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updatedUser } = useAuth();

  const handleAvatarChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        try {
          const avatar = new FormData();
          avatar.append('avatar', event.target.files[0]);
          const updattedUser = await api.patch('/users/avatar/', avatar);
          updatedUser(updattedUser.data);
          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
          });
        } catch (e) {
          addToast({
            title: 'Erro na atualização do avatar',
            description:
              'Ocorreu um erro na atualização do avatar, tente novamente.',
            type: 'error',
          });
        }
      }
    },
    [addToast, updatedUser],
  );

  const handleSubmit = useCallback(
    async (data: FormaDataProps) => {
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

        const response = await api.put('/profile', formData);
        updatedUser(response.data);

        history.push('/dashboard');
        addToast({
          type: 'success',
          title: 'Cadastro atualizado!',
          description: 'Seu cadastro foi atualizado com sucesso!',
        });
      } catch (error) {
        console.log(error);
        if (error instanceof Yup.ValidationError) {
          const errors = validationsErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          title: 'Erro na atualização de dados',
          description:
            'Ocorreu um erro ao fazer a atualização dos dados, tente novamente.',
          type: 'error',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <ProfileImage>
            <img src={user.avatar_url} alt={user.name} />

            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChange}
              />
            </label>
          </ProfileImage>
          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
          <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />

          <div id="password-division">
            <Input
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="Senha atual"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />
          </div>
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
