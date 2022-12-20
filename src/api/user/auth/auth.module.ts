import { GoogleOauthController } from './oauth2/google/google_oauth.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/api/user/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthHelper } from './auth.helper';
import { AuthService } from './auth.service';
import { JwtStrategy } from './auth.strategy';
import { ConfigService } from '@nestjs/config';
import { RoleService } from '@/api/role/role.service';
import { Role } from '@/api/role/entities/role.entity';
import { EmailService } from '@/api/email/email.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [AuthController, GoogleOauthController],
  providers: [AuthService, AuthHelper, JwtStrategy, RoleService, EmailService]
})
export class AuthModule { }
