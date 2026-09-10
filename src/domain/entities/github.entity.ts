export interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  payload: Record<string, unknown>;
  created_at: string;
}

export type GithubActivityKind = 'push' | 'pull-request' | 'branch' | 'issue';

export interface GithubActivityItem {
  id: string;
  kind: GithubActivityKind;
  text: string;
  repo: string;
  date: string;
}
