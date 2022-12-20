import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleOauthStrategy } from './google_oauth.strategy';
import { Module } from "@nestjs/common";
import { GoogleOauthController } from "./google_oauth.controller";
import { User } from '@/api/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth.service';
import { RoleService } from '@/api/role/role.service';
import { EmailService } from '@/api/email/email.service';
import { AuthHelper } from '../../auth.helper';
import { Role } from '@/api/role/entities/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    controllers: [GoogleOauthController],
    providers: [GoogleOauthStrategy, AuthService, JwtService, RoleService, EmailService, AuthHelper]
})
export class GoogleOauthModule { }