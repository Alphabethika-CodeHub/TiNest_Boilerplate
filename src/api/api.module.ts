import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { LogModule } from './log/log.module';
import { FactoryModule } from './factory/factory.module';
import { SeederModule } from './seeder/seeder.module';
import { EmailModule } from './email/email.module';
import configuration from './config/configuration';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    UserModule,
    RoleModule,
    LogModule,
    FactoryModule,
    SeederModule,
    EmailModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get<string>('smtp.host'),
            port: configService.get<string>('smtp.port'),
            secure: false,
            auth: {
              user: configService.get<string>('smtp.username'),
              pass: configService.get<string>('smtp.password'),
            },
          },

          defaults: {
            from: '"Admin GS" <no-reply@gs.artisan.com>',
          },
          template: {
            dir: `${__dirname}/src/templates`,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          uploads: {
            dir: `${__dirname}/src/uploads`,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    })]
})
export class ApiModule { }
