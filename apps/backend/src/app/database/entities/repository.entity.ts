import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PullRequestEntity } from './pull-request.entity';

@Entity('repositories')
export class RepositoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  githubRepoId!: string;

  @Column({ type: 'varchar', length: 255 })
  repoName!: string;

  @Column({ type: 'varchar', length: 100 })
  owner!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'boolean', default: true })
  isPublic!: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  language!: string;

  @Column({ type: 'int', default: 0 })
  stars!: number;

  @Column({ type: 'int', default: 0 })
  forks!: number;

  @Column({ type: 'int', default: 0 })
  openIssues!: number;

  @Column({ type: 'varchar', length: 100 })
  defaultBranch!: string;

  @Column({ type: 'text' })
  repoUrl!: string;

  @Column({ type: 'timestamp', nullable: true })
  pushedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAtGit!: Date;

  @ManyToOne(() => UserEntity, (user) => user.repositories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'boolean', default: false })
  isSubscribed!: boolean;

  @OneToMany(() => PullRequestEntity, (pullRequest) => pullRequest.repository)
  pullRequests!: PullRequestEntity[];
}
