import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleGuard } from '../user/auth/auth.guard';
import { ReturnInterface, RoleList } from '@/common/helper/constant';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Get('/')
  @UseGuards(RoleGuard(RoleList.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  private async findAll(): Promise<ReturnInterface> {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.roleService.findAll(),
    };
  }

  @Get('/detail/:id')
  @UseGuards(RoleGuard(RoleList.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  private async findOne(@Param('id') id: string): Promise<ReturnInterface> {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.roleService.findOne(id),
    };
  }

  @Post('/create')
  @UseGuards(RoleGuard(RoleList.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  private async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ReturnInterface> {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data: await this.roleService.create(createRoleDto),
    };
  }

  @Patch('/update/:id')
  @UseGuards(RoleGuard(RoleList.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  private async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ReturnInterface> {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.roleService.update(id, updateRoleDto),
    };
  }

  @Delete('/delete/:id')
  @UseGuards(RoleGuard(RoleList.Admin))
  @UseInterceptors(ClassSerializerInterceptor)
  private async remove(@Param('id') id: string): Promise<ReturnInterface> {
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: await this.roleService.delete(id),
    };
  }
}
