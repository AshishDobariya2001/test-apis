import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RewardHistory } from './reward-history.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ name: 'p5Balance', type: 'int', default: 0 })
  p5Balance: number;

  @Column({ name: 'rewardsBalance', type: 'int', default: 0 })
  rewardsBalance: number;

  @OneToMany(() => RewardHistory, (rewardHistory) => rewardHistory.givenBy)
  rewardHistoryGiven: RewardHistory[];

  @OneToMany(() => RewardHistory, (rewardHistory) => rewardHistory.givenTo)
  rewardHistoryReceived: RewardHistory[];
}
