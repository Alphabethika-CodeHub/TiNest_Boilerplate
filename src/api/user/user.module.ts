import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { GoogleOauthModule } from './auth/oauth2/google/google_oauth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, GoogleOauthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
