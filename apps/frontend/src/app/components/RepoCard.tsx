import { Repo } from "../repos/_page";
import { BellFilledIcon, BellIcon, ForkIcon, IssueIcon, SpinnerIcon, StarIcon } from "./Icons";

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  Python:     "#3572A5",
  Java:       "#B07219",
  HTML:       "#E34C26",
  CSS:        "#563D7C",
  Go:         "#00ADD8",
  Rust:       "#DEA584",
};


export function RepoCard({
  repo,
  isSubscribing,
  onToggleSubscribe,
}: {
  repo: Repo;
  isSubscribing: boolean;
  onToggleSubscribe: () => void;
}) {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? "#7D8590" : null;
  const pushedAgo = timeAgo(repo.pushedAt);

  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-[#1E2730] bg-[#0D1117] px-5 py-4 transition-colors hover:border-[#2A3540]">
      <div className="flex items-start justify-between gap-4">

        {/* Left: name + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <a
              href={repo.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-medium text-[#58A6FF] hover:underline truncate"
            >
              {repo.repoName}
            </a>
            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
              repo.isPublic
                ? "border-[#1A3626] text-[#3FB950]"
                : "border-[#2D1515] text-[#FF7B72]"
            }`}>
              {repo.isPublic ? "Public" : "Private"}
            </span>
            {repo.isSubscribed && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-[#1E3A5A] text-[#58A6FF]">
                Subscribed
              </span>
            )}
          </div>

          <p className="text-[13px] text-[#7D8590] leading-relaxed line-clamp-2">
            {repo.description ?? "No description provided."}
          </p>
        </div>

        {/* Right: subscribe button */}
        <button
          onClick={onToggleSubscribe}
          disabled={isSubscribing}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            repo.isSubscribed
              ? "bg-[#1A3626] border-[#2A5440] text-[#3FB950] hover:bg-[#2D1515] hover:border-[#5C2020] hover:text-[#FF7B72]"
              : "bg-[#161B22] border-[#2A3540] text-[#7D8590] hover:border-[#3FB950] hover:text-[#3FB950]"
          }`}
        >
          {isSubscribing ? (
            <SpinnerIcon size={13} />
          ) : repo.isSubscribed ? (
            <BellFilledIcon size={13} />
          ) : (
            <BellIcon size={13} />
          )}
          {isSubscribing
            ? "..."
            : repo.isSubscribed
            ? "Subscribed"
            : "Subscribe"}
        </button>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-[12px] text-[#7D8590] flex-wrap">
        {langColor && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: langColor }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <StarIcon size={13} />
          {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <ForkIcon size={13} />
          {repo.forks}
        </span>
        {repo.openIssues > 0 && (
          <span className="flex items-center gap-1 text-[#E3B341]">
            <IssueIcon size={13} />
            {repo.openIssues} open issues
          </span>
        )}
        <span className="ml-auto">Updated {pushedAgo}</span>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  const months= Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (mins < 60)   return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days < 30)   return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}