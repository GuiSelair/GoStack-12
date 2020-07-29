import React, { useState, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import logoImg from '../../assets/logo-github-explorer.svg';
import api from '../../services/api';

import { Title, Form, Repositories} from "./styles";

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}


const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);


  const handleAddRepository = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await api.get<Repository>(`repos/${newRepo}`)
    const repository = response.data;

    setRepositories([...repositories, repository]);
    setNewRepo('');
  };

  return (
    <>
      <img src={logoImg} alt="Logo Github_Explorer"/>
      <Title>Explore repositórios</Title>

      <Form onSubmit={handleAddRepository}>
        <input
          type="text"
          placeholder='Digite o nome do repositório'
          value = {newRepo}
          onChange = {(event) => setNewRepo(event?.target.value)}

        />
        <button type="submit">Pesquisar</button>
      </Form>

      <Repositories>
        {repositories.map(repository => (
          <a key={ repository.full_name } href="#">
            <img src={ repository.owner.avatar_url } alt={ repository.owner.login }/>
            <div>
              <strong>{ repository.full_name }</strong>
              <p>{ repository.description }</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}


      </Repositories>
    </>
  )
}

export default Dashboard


