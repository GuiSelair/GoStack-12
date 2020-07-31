import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import logoImg from '../../assets/logo-github-explorer.svg';
import api from '../../services/api';

import { Title, Form, Repositories, Error } from "./styles";
import { Link } from 'react-router-dom';

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
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer: repositories');
    if (storagedRepositories){
      return JSON.parse(storagedRepositories);
    }else{
      return [];
    }
  });
  const [inputError, setInputError] = useState('');


  useEffect(() => {
    localStorage.setItem('@GithubExplorer: repositories', JSON.stringify(repositories));
  }, [repositories]);


  const handleAddRepository = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newRepo){
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try{
      const response = await api.get<Repository>(`repos/${newRepo}`)
      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    }catch(err){
      setInputError('Erro na busca por este repositório.');
    }
  };

  return (
    <>
      <img src={logoImg} alt="Logo Github_Explorer"/>
      <Title>Explore repositórios</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          type="text"
          placeholder='Digite o nome do repositório'
          value = {newRepo}
          onChange = {(event) => setNewRepo(event?.target.value)}

        />
        <button type="submit">Pesquisar</button>
      </Form>

      { inputError && <Error>{ inputError }</Error> }

      <Repositories>
        {repositories.map(repository => (
          <Link key={ repository.full_name } to={`repositories/${repository.full_name}`}>
            <img src={ repository.owner.avatar_url } alt={ repository.owner.login }/>
            <div>
              <strong>{ repository.full_name }</strong>
              <p>{ repository.description }</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}


      </Repositories>
    </>
  )
}

export default Dashboard


