import { QueryDeepPartialEntity } from 'typeorm';
import { PullRequestEntity } from '../database/entities/pull-request.entity';

export class PullRequestMapper {
  static toEntity(payload: Record<string, any>): QueryDeepPartialEntity<PullRequestEntity> {
    const pr = payload.payload.pull_request;

    const repository = payload.payload.repository;

    const sender = payload.payload.sender;

    return {
      githubRepositoryId: repository.id.toString(),

      githubPullRequestId: pr.id.toString(),

      pullRequestNumber: pr.number,

      action: payload.payload.action,

      state: pr.state,

      merged: pr.merged,

      mergedAt: pr.merged_at ? new Date(pr.merged_at) : undefined,

      closedAt: pr.closed_at ? new Date(pr.closed_at) : undefined,

      title: pr.title,

      body: pr.body,

      htmlUrl: pr.html_url,

      diffUrl: pr.diff_url,

      patchUrl: pr.patch_url,

      headBranch: pr.head.ref,

      baseBranch: pr.base.ref,

      headSha: pr.head.sha,

      commits: pr.commits,

      additions: pr.additions,

      deletions: pr.deletions,

      changedFiles: pr.changed_files,

      comments: pr.comments,

      reviewComments: pr.review_comments,

      authorUsername: pr.user.login,

      authorAvatarUrl: pr.user.avatar_url,

      authorProfileUrl: pr.user.html_url,

      senderUsername: sender.login,

      githubCreatedAt: new Date(pr.created_at),

      githubUpdatedAt: new Date(pr.updated_at),

      rawPayload: payload,
    };
  }
}
