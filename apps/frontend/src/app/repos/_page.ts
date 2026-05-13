'use client';

import { useEffect, useState } from 'react';
import httpClient from '../services/http-client.service';

export interface Repo {
  id: string;
  githubRepoId: string;
  repoName: string;
  owner: string;
  description: string | null;
  isPublic: boolean;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  repoUrl: string;
  pushedAt: string;
  isSubscribed: boolean;
}

export function useRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchRepositories = () => {
    setIsLoading(true);
    httpClient
      .get('/api/repositories')
      .then((res) => {
        console.log(res);
        const [data, count] = res;
        setRepos(data);
        setTotal(count);
      })
      .catch((error) => setError('Failed to load repositories.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchRepositories, []);

  const syncRepos = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      await httpClient.get('/api/repositories/sync'); // triggers GitHub fetch on backend
      fetchRepositories();
    } catch {
      setError('Sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleSubscribe = async (repo: Repo) => {
    setSubscribingId(repo.id);
    try {
      if (repo.isSubscribed) {
        await httpClient.delete(`/api/repositories/${repo.id}/unsubscribe`);
      } else {
        await httpClient.post(`/api/repositories/${repo.id}/subscribe`);
      }

      setRepos((prev) =>
        prev.map((r) =>
          r.id === repo.id ? { ...r, isSubscribed: !r.isSubscribed } : r,
        ),
      );
    } catch {
      // silently fail — could add a toast here
    } finally {
      setSubscribingId(null);
    }
  };

  const filteredRepos = repos.filter((r) => {
    const matchesSearch = r.repoName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'public' && r.isPublic) ||
      (filter === 'private' && !r.isPublic);
    return matchesSearch && matchesFilter;
  });

  return {
    repos: filteredRepos,
    total,
    isLoading,
    error,
    subscribingId,
    search,
    setSearch,
    filter,
    setFilter,
    toggleSubscribe,
    syncRepos,
    isSyncing,
  };
}
