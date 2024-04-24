import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RewardHistory, User } from 'src/framework/entites';

@Module({
  imports: [TypeOrmModule.forFeature([User, RewardHistory])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
