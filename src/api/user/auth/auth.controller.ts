import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { User } from '@/api/user/entity/user.entity';
import { RegisterDto, LoginDto, OauthRegisterDto } from './dto/auth.dto';
import { RoleGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { RoleList } from '@/common/helper/constant';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @Post('register/:registerType')
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto, @Param('registerType') registerType: string, objectData: OauthRegisterDto): Promise<object | never> {
    return this.service.register(body, registerType, objectData);
  }

  @Post('login')
  private login(@Body() body: LoginDto): Promise<object | never> {
    return this.service.login(body);
  }

  @Post('refresh')
  @UseGuards(RoleGuard(RoleList.Admin))
  private refresh(@Req() { user }: Request): Promise<string | never> {
    return this.service.refresh(<User>user);
  }
}
