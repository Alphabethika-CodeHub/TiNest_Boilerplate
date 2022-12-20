import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { MulterModule } from '@nestjs/platform-express';
import { SentryModule } from '@ntegral/nestjs-sentry';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),

    // Setup Sentry.
    SentryModule.forRootAsync({
      // Get The DSN at Sentry.io Releases Dashboard
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          dsn: configService.get<string>("SENTRY"),
          debug: true,
          environment: "dev",
          release: null,
          logLevels: ['debug'],
        }
      },
      inject: [ConfigService]
    }),

    MulterModule.register({
      dest: './uploads'
    }),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
