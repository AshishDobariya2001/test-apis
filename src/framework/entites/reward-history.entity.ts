import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('reward_history')
export class RewardHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  datetimeStamp: Date;

  @Column({ type: 'int', name: 'points' })
  points: number;

  @ManyToOne(() => User, (user) => user.rewardHistoryGiven)
  givenBy: User;

  @ManyToOne(() => User, (user) => user.rewardHistoryReceived)
  givenTo: User;
}
