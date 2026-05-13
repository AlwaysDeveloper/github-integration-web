import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  userId!: string;

  @Column()
  type!: 'email' | 'push';

  @Column()
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}