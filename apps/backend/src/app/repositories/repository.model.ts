export class Repository {
  id!: string | undefined;
  userId!: string;
  githubRepoId!: string;
  repoName!: string;
  owner!: string;
  description!: string;
  isPublic!: boolean;
  language!: string;
  stars!: number;
  forks!: number;
  openIssues!: number;
  defaultBranch!: string;
  repoUrl!: string;
  pushedAt!: Date;
  updatedAtGit!: Date;
}
