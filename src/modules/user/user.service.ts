import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RewardHistory, User } from 'src/framework/entites';
import { Repository } from 'typeorm';
import { RewardDto, RewardHistoryDto } from './dto/reward.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RewardHistory)
    private rewardRepository: Repository<RewardHistory>,
  ) {}

  async createUser(userDto: UserDto) {
    return this.userRepository.save({
      name: userDto.name,
      p5Balance: 100,
      rewardsBalance: 0,
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createReward(id: string, rewardDto: RewardDto) {
    const giver = await this.userRepository.findOne({
      where: {
        id: rewardDto.givenBy,
      },
    });
    const receiver = await this.userRepository.findOne({
      where: {
        id: rewardDto.givenTo,
      },
    });
    if (!giver || !receiver) {
      throw new NotFoundException('User not found');
    }

    if (giver.p5Balance < rewardDto.amount) {
      throw new Error('Insufficient P5 balance');
    }

    await this.rewardRepository.save({
      givenBy: giver,
      givenTo: receiver,
      points: rewardDto.amount,
      datetimeStamp: new Date(),
    });

    giver.p5Balance -= rewardDto.amount;
    receiver.p5Balance += rewardDto.amount;
    await this.userRepository.save(giver);
    await this.userRepository.save(receiver);
  }

  async getP5HistoryForUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['rewardHistoryGiven'],
    });
    console.log('🚀 ~ UserService ~ getP5HistoryForUser ~ user:', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getRewardHistory(userId: string): Promise<RewardHistoryDto[]> {
    const rewardHistories = await this.rewardRepository.find({
      where: {
        givenTo: {
          id: userId,
        },
      },
      relations: ['givenBy'],
      order: {
        datetimeStamp: 'DESC',
      },
    });

    return rewardHistories.map((history) => ({
      id: history.id,
      dateTime: history.datetimeStamp,
      pointsReceived: history.points,
      givenByName: history.givenBy.name,
    }));
  }

  async deleteReward(rewardId: string): Promise<void> {
    const reward = await this.rewardRepository.findOne({
      where: { id: rewardId },
      relations: ['givenBy', 'givenTo'],
    });
    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    reward.givenBy.p5Balance += reward.points;
    reward.givenTo.p5Balance -= reward.points;
    await this.userRepository.save([reward.givenBy, reward.givenTo]);
    await this.rewardRepository.remove(reward);
  }
}
