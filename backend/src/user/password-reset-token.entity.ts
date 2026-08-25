import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tokenHash!: string;

  @ManyToOne(() => User, (user) => user.passwordResetTokens)
  user!: User;

  @Column()
  expiresAt!: Date;

  @Column()
  used!: boolean;
}
