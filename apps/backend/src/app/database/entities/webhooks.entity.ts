import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RepositoryEntity } from './repository.entity';

@Entity('webhooks')
export class WebhookEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  githubWebhookId!: string;

  @Column({ type: 'varchar', length: 255 })
  webhookUrl!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'simple-array' })
  events!: string[];

  @ManyToOne(() => RepositoryEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'repositoryId' })
  repository!: RepositoryEntity;

  @Column()
  repositoryId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}