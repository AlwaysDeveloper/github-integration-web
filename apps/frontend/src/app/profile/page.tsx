'use client'

import { ErrorState } from "../components/ErrorState";
import { GitHubIcon } from "../components/GitHubIcon";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { MetaRow } from "../components/MetaRow";
import { useProfile } from "./_page";

export default function ProfilePage() {
  const { profile, isLoading, error } = useProfile();

  if (isLoading) return <LoadingSkeleton />;
  if (error)     return <ErrorState message={error} />;
  if (!profile)  return null;

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const stats = [
    { label: "Repositories", value: profile.publicRepos },
    { label: "Followers",    value: profile.followers },
    { label: "Following",    value: profile.following },
  ];

  return (
    <div className="min-h-screen bg-[#080C10] px-6 py-12 pt-16">
      <div className="mx-auto max-w-lg">

        {/* Card */}
        <div className="rounded-xl border border-[#1E2730] bg-[#0D1117] overflow-hidden">

          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-[#0D1117] via-[#161B22] to-[#0D1117] border-b border-[#1E2730] relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(#3FB950 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          <div className="px-8 pb-8 relative">
            {/* Avatar + name */}
            <div className="flex items-end gap-5 -mt-10 mb-6">
              <img
                src={profile.avatar}
                alt={profile.username}
                className="h-20 w-20 rounded-full border-4 border-[#0D1117] ring-1 ring-[#2A3540] shrink-0"
              />
              <div className="pb-1">
                <h1 className="text-[20px] font-medium text-white tracking-tight">
                  {profile.username}
                </h1>
                <a
                  href={`https://github.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#58A6FF] hover:underline"
                >
                  @{profile.username}
                </a>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[13px] text-[#7D8590] mb-6 leading-relaxed">
              {profile.bio ?? "No bio provided."}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1 rounded-lg border border-[#1E2730] bg-[#161B22] py-4"
                >
                  <span className="text-[22px] font-semibold text-white tracking-tight">
                    {s.value}
                  </span>
                  <span className="text-[11px] text-[#7D8590] tracking-[0.06em] uppercase">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Meta info */}
            <div className="border-t border-[#1E2730] pt-5 flex flex-col gap-3">
              <MetaRow icon="ti-id-badge"  label="GitHub ID"   value={`#${profile.githubId}`} />
              <MetaRow icon="ti-calendar"  label="Joined"      value={joinedDate} />
              {profile.lastProfileUpdate && (
                <MetaRow
                  icon="ti-refresh"
                  label="Last synced"
                  value={new Date(profile.lastProfileUpdate).toLocaleDateString("en-US", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                />
              )}
            </div>

            {/* CTA */}
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#2A3540] bg-[#161B22] py-2.5 text-[13px] font-medium text-white transition-all hover:border-[#3FB950] hover:shadow-[0_0_12px_rgba(63,185,80,0.1)]"
            >
              <GitHubIcon size={15} />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


