import {
  ClassSerializerInterceptor,
  Controller,
  Req,
  UseGuards,
  UseInterceptors,
  Put,
  Body,
  Inject,
  Get,
  Param,
  HttpStatus,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { RoleGuard } from '@/api/user/auth/auth.guard';
import { UpdateNameDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { RoleList } from '@/common/helper/constant';

@Controller('users')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get('/')
  @UseGuards(RoleGuard(RoleList.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  private getUsers(): Promise<object | never> {
    console.log("Hit Get Users");
    return this.service.getUsers();
  }

  @Get('/detail/:id')
  @UseGuards(RoleGuard(RoleList.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  private async findOneUser(
    @Param() param,
  ): Promise<{ statusCode: any; message: string; data: object }> {
    console.log("Hit Find User");
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.service.findOneUser(param.id),
    };
  }

  @Put('/update/:id')
  @UseGuards(RoleGuard(RoleList.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  private updateUser(
    @Body() body: UpdateNameDto,
    @Req() req: Request,
  ): Promise<User> {
    console.log("Hit Update User");
    return this.service.updateUser(body, req);
  }

  @Delete('/delete/:id')
  @UseGuards(RoleGuard(RoleList.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  private async deleteUser(
    @Param("id", ParseUUIDPipe) id: string
  ) {
    console.log("Hit Delete User");
    return await this.service.deleteUser(id);
  }
}
