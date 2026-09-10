import React, { useEffect, useState } from 'react';
import { FiGithub, FiGitCommit, FiGitPullRequest, FiGitBranch, FiCircle, FiLoader } from 'react-icons/fi';
import { getRecentGithubActivity, type GithubActivityItem, type GithubActivityKind } from '@application/useCases/github/getRecentGithubActivity';

const KIND_ICON: Record<GithubActivityKind, React.ReactNode> = {
  push: <FiGitCommit className="w-3.5 h-3.5 text-emerald-500" />,
  'pull-request': <FiGitPullRequest className="w-3.5 h-3.5 text-purple-500" />,
  branch: <FiGitBranch className="w-3.5 h-3.5 text-cyan-500" />,
  issue: <FiCircle className="w-3.5 h-3.5 text-amber-500" />,
};

interface GithubActivityProps {
  username: string;
}

export const GithubActivity: React.FC<GithubActivityProps> = ({ username }) => {
  const [items, setItems] = useState<GithubActivityItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getRecentGithubActivity(username, 5, controller.signal)
      .then(setItems)
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [username]);

  return (
    <div className="editorial-card p-5 rounded-lg space-y-4">
      <div className="flex items-center gap-2 text-[var(--theme-ink)] border-b border-[var(--theme-border)] pb-3">
        <FiGithub className="w-4 h-4" />
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider">Actividad Reciente en GitHub</h3>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-[10px] font-mono text-[var(--theme-accent)] hover:underline"
        >
          @{username}
        </a>
      </div>

      {!items && !failed && (
        <div className="flex items-center gap-2 py-4 text-[var(--theme-ink-muted)] justify-center">
          <FiLoader className="w-3.5 h-3.5 animate-spin" />
          <span className="text-xs font-mono">Cargando...</span>
        </div>
      )}

      {failed && (
        <p className="text-xs font-mono text-[var(--theme-ink-muted)] text-center py-4">
          No se pudo cargar la actividad en este momento.
        </p>
      )}

      {items && items.length === 0 && (
        <p className="text-xs font-mono text-[var(--theme-ink-muted)] text-center py-4">
          Sin actividad pública reciente.
        </p>
      )}

      {items && items.length > 0 && (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2 text-xs">
              <span className="mt-0.5 shrink-0">{KIND_ICON[item.kind]}</span>
              <span className="text-[var(--theme-ink)] font-light">
                {item.text}{' '}
                <span className="text-[var(--theme-ink-muted)] font-mono">
                  en {item.repo.split('/')[1] ?? item.repo}
                </span>
              </span>
              <span className="ml-auto shrink-0 text-[10px] font-mono text-[var(--theme-ink-muted)]">{item.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
