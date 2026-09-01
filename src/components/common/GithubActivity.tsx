import React, { useEffect, useState } from 'react';
import { FiGithub, FiGitCommit, FiGitPullRequest, FiGitBranch, FiCircle, FiLoader } from 'react-icons/fi';

interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  payload: Record<string, unknown>;
  created_at: string;
}

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  text: string;
  repo: string;
  date: string;
}

const relativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days}d`;
  return new Date(iso).toLocaleDateString('es-EC', { month: 'short', day: 'numeric' });
};

const describeEvent = (event: GithubEvent): ActivityItem | null => {
  const repo = event.repo.name;
  switch (event.type) {
    case 'PushEvent': {
      const commits = (event.payload.commits as unknown[] | undefined)?.length ?? 1;
      return {
        id: event.id,
        icon: <FiGitCommit className="w-3.5 h-3.5 text-emerald-500" />,
        text: `Push de ${commits} commit${commits !== 1 ? 's' : ''}`,
        repo,
        date: relativeTime(event.created_at),
      };
    }
    case 'PullRequestEvent': {
      const action = event.payload.action as string;
      return {
        id: event.id,
        icon: <FiGitPullRequest className="w-3.5 h-3.5 text-purple-500" />,
        text: action === 'opened' ? 'Abrió un Pull Request' : action === 'merged' ? 'Mergeó un Pull Request' : `PR ${action}`,
        repo,
        date: relativeTime(event.created_at),
      };
    }
    case 'CreateEvent': {
      const refType = event.payload.ref_type as string;
      return {
        id: event.id,
        icon: <FiGitBranch className="w-3.5 h-3.5 text-cyan-500" />,
        text: refType === 'repository' ? 'Creó el repositorio' : `Creó ${refType} en`,
        repo,
        date: relativeTime(event.created_at),
      };
    }
    case 'IssuesEvent': {
      const action = event.payload.action as string;
      return {
        id: event.id,
        icon: <FiCircle className="w-3.5 h-3.5 text-amber-500" />,
        text: `Issue ${action === 'opened' ? 'abierto' : action}`,
        repo,
        date: relativeTime(event.created_at),
      };
    }
    default:
      return null;
  }
};

interface GithubActivityProps {
  username: string;
}

export const GithubActivity: React.FC<GithubActivityProps> = ({ username }) => {
  const [items, setItems] = useState<ActivityItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${username}/events/public?per_page=15`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((events: GithubEvent[]) => {
        const parsed = events
          .map(describeEvent)
          .filter((e): e is ActivityItem => e !== null)
          .slice(0, 5);
        setItems(parsed);
      })
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
              <span className="mt-0.5 shrink-0">{item.icon}</span>
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
