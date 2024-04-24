import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RewardHistory, User } from 'src/framework/entites';
import { DATABASE_URL, ENVIRONMENT } from 'src/framework/environment';

const connectConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: [User, RewardHistory],
  logging: ENVIRONMENT === 'local',
  autoLoadEntities: true,
  synchronize: true,
};

const config = {
  connectConfig,
};

export = config;
