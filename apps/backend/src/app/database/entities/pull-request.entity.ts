import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RepositoryEntity } from './repository.entity';


@Entity('pull_requests')
@Index(
  ['githubRepositoryId', 'pullRequestNumber'],
  {
    unique: true,
  },
)
export class PullRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * GitHub Pull Request ID
   */
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  githubPullRequestId!: string;

  /**
   * GitHub Repository ID
   * Joins with RepositoryEntity.githubRepoId
   */
  @Column({
    type: 'varchar',
    length: 100,
  })
  githubRepositoryId!: string;

  @ManyToOne(
    () => RepositoryEntity,
    (repository) => repository.pullRequests,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'githubRepositoryId',
    referencedColumnName: 'githubRepoId',
  })
  repository!: RepositoryEntity;

  @Column({
    type: 'int',
  })
  pullRequestNumber!: number;

  @Column({
    length: 50,
  })
  action!: string;

  @Column({
    length: 20,
  })
  state!: string;

  @Column({
    default: false,
  })
  merged!: boolean;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  mergedAt?: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  closedAt?: Date;

  @Column({
    length: 500,
  })
  title!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  body?: string | null;

  @Column({
    length: 500,
  })
  htmlUrl!: string;

  @Column({
    length: 500,
  })
  diffUrl!: string;

  @Column({
    length: 500,
  })
  patchUrl!: string;

  @Column({
    length: 255,
  })
  headBranch!: string;

  @Column({
    length: 255,
  })
  baseBranch!: string;

  @Column({
    length: 255,
  })
  headSha!: string;

  @Column({
    type: 'int',
    default: 0,
  })
  commits!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  additions!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  deletions!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  changedFiles!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  comments!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  reviewComments!: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  authorUsername!: string;

  @Column({
    type: 'text',
  })
  authorAvatarUrl!: string;

  @Column({
    type: 'text',
  })
  authorProfileUrl!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  senderUsername!: string;

  @Column({
    type: 'timestamp',
  })
  githubCreatedAt!: Date;

  @Column({
    type: 'timestamp',
  })
  githubUpdatedAt!: Date;

  @Column({
    type: 'json',
  })
  rawPayload!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}