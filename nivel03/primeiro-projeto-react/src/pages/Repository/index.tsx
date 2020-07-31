import React, {useEffect, useState} from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRouteMatch, Link } from 'react-router-dom';

import { Header, RepositoryInfo, Issues } from './styles';
import logoImg from '../../assets/logo-github-explorer.svg';
import api from '../../services/api';


interface RepositoryParams {
  nameRepository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  }
}

interface Issue{
  title: string;
  id: number;
  html_url: string;
  user: {
    login: string;
  }
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const [repository, setRepository] = useState<Repository | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    async function loadData(): Promise<void> {
      const [repositoryResponse, issuesResponse] = await Promise.all([
        api.get(`repos/${params.nameRepository}`),
        api.get(`repos/${params.nameRepository}/issues`),
      ])
      setRepository(repositoryResponse.data);
      setIssues(issuesResponse.data);
    }

    loadData();
  }, [params.nameRepository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github-Explorer"/>
        <Link to='/'><FiChevronLeft size={16}/> Voltar</Link>
      </Header>

      { repository &&

      <RepositoryInfo>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
          <div>
            <strong>{repository.full_name}</strong>
            <p>{repository.description}</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>{repository.stargazers_count}</strong>
            <span>Stars</span>
          </li>
          <li>
            <strong>{repository.forks_count}</strong>
            <span>Forks</span>
          </li>
          <li>
            <strong>{repository.open_issues_count}</strong>
            <span>Issues Abertas</span>
          </li>
        </ul>
      </RepositoryInfo>
      }

      <Issues>

      {issues.map(issue => (
        <a href={issue.html_url} key={issue.id}>
          <div>
            <strong>{issue.title}</strong>
            <p>{issue.user.login}</p>
          </div>
          <FiChevronRight size={20} />
        </a>
      ))}

      </Issues>
    </>
  )
}

export default Repository


