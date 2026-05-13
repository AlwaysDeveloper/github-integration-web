'use client';

import { IssueIcon, SearchIcon, SyncIcon } from '../components/Icons';
import { RepoCard } from '../components/RepoCard';
import { useRepos, Repo } from './_page';

export default function ReposPage() {
  const {
    repos,
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
    isSyncing
  } = useRepos();

  return (
    <div className="min-h-screen bg-[#080C10] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-medium text-white tracking-tight mb-1">
              Repositories
            </h1>
            <p className="text-[13px] text-[#7D8590]">
              {total} repositories · Subscribe to get pull request notifications
            </p>
          </div>
          <button
            onClick={syncRepos}
            disabled={isSyncing || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2A3540] bg-[#161B22] text-[13px] font-medium text-[#7D8590] hover:border-[#58A6FF] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SyncIcon size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync repos'}
          </button>
        </div>

        {/* Search + filter bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3D444D]" />
            <input
              type="text"
              placeholder="Find a repository..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#1E2730] rounded-lg pl-9 pr-4 py-2.5 text-[13px] text-[#E6EDF3] placeholder-[#3D444D] outline-none focus:border-[#58A6FF] transition-colors"
            />
          </div>

          <div className="flex gap-1 bg-[#0D1117] border border-[#1E2730] rounded-lg p-1">
            {(['all', 'public', 'private'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-[#1E2730] text-white'
                    : 'text-[#7D8590] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {isLoading && <LoadingSkeleton />}
        {error && <ErrorState message={error} />}
        {!isLoading && !error && repos.length === 0 && (
          <EmptyState hasSearch={search.length > 0} />
        )}

        {/* Repo list */}
        {!isLoading && !error && repos.length > 0 && (
          <div className="flex flex-col gap-3">
            {repos.map((repo: any) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                isSubscribing={subscribingId === repo.id}
                onToggleSubscribe={() => toggleSubscribe(repo)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
/* ── Skeletons & states ── */

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[#1E2730] bg-[#0D1117] px-5 py-4 animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="h-4 w-48 rounded bg-[#1E2730]" />
            <div className="h-8 w-24 rounded-lg bg-[#1E2730]" />
          </div>
          <div className="h-3 w-3/4 rounded bg-[#1E2730] mb-4" />
          <div className="flex gap-4">
            <div className="h-3 w-16 rounded bg-[#1E2730]" />
            <div className="h-3 w-10 rounded bg-[#1E2730]" />
            <div className="h-3 w-10 rounded bg-[#1E2730]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <i
        className="ti ti-alert-circle text-[#FF7B72]"
        style={{ fontSize: 32 }}
      />
      <p className="text-[14px] text-[#7D8590]">{message}</p>
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <i className="ti ti-git-branch text-[#3D444D]" style={{ fontSize: 32 }} />
      <p className="text-[14px] text-[#7D8590]">
        {hasSearch
          ? 'No repositories match your search.'
          : 'No repositories found.'}
      </p>
    </div>
  );
}
