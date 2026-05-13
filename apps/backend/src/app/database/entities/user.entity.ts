import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RepositoryEntity } from './repository.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 100, nullable: true })
  email!: string;

  @Column({ unique: true, length: 100, nullable: false })
  username!: string;

  @Column({ unique: true, length: 100, nullable: false })
  githubId!: string;

  @Column({ nullable: true, type: 'text' })
  avatar!: string;

  @Column({ nullable: true, type: 'text' })
  bio!: string;

  @Column({ default: 0, type: 'int' })
  followers!: number;

  @Column({ default: 0, type: 'int' })
  following!: number;

  @Column({ default: 0, type: 'int' })
  publicRepos!: number;

  @Column({ nullable: true, type: 'date' })
  lastProfileUpdate!: Date;

  @Column({ type: 'text', nullable: true, select: true })
  token!: string;

  @Column({ type: 'text', nullable: true, select: true })
  refreshToken!: string;

  @Column({ nullable: true, type: 'date' })
  lastRepoUpdate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => RepositoryEntity, (repo) => repo.user)
  repositories!: RepositoryEntity[];
}
