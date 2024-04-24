import {
  Controller,
  Post,
  Get,
  Body,
  Redirect,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/framework/entites';
import { RewardDto } from './dto/reward.dto';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('new')
  async createUser(@Body() userDto: UserDto) {
    console.log('🚀 ~ UserController ~ createUser ~ userDto:', userDto);
    return this.userService.createUser(userDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id/rewards/new')
  async createReward(@Param() id: string, @Body() rewardDto: RewardDto) {
    return this.userService.createReward(id, rewardDto);
  }

  @Get(':id/p5')
  async getP5History(@Param('id') id: string) {
    return this.userService.getP5HistoryForUser(id);
  }

  @Get(':id/rewards')
  async getRewardHistory(@Param('id') id: string) {
    return this.userService.getRewardHistory(id);
  }

  @Delete('rewards/:rewardId')
  async deleteP5Reward(@Param('rewardId') rewardId: string) {
    return this.userService.deleteReward(rewardId);
  }
}
