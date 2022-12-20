import { ConfigService } from '@nestjs/config';
import { ErrHandler } from '@/common/helper/errHandler';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly configService: ConfigService,
    private datasource: DataSource
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<object | never> {
    let isExistRole;
    let insertedRole;

    this.configService.get<string>('DATABASE_CLIENT') === 'mysql' ?
      isExistRole = await this.roleRepository
        .createQueryBuilder('roles')
        .where(`roles.name like '%${createRoleDto.name}%'`)
        .getOne() : // Else if Postgres
      isExistRole = await this.roleRepository
        .createQueryBuilder('roles')
        .where(`roles.name ilike '%${createRoleDto.name}%'`)
        .getOne();

    if (isExistRole) {
      throw ErrHandler(HttpStatus.BAD_REQUEST, `Role '${createRoleDto.name.toUpperCase()}' already exist!`, "Create Role but existing.");
    }

    try {
      await this.datasource.transaction(async (trx) => {
        const role = new Role();
        role.name = createRoleDto.name.toUpperCase();
        role.status = true;
        await trx.insert(Role, role);

        insertedRole = role;

        return role;
      })
    } catch (error) {
      console.log('Error Create Role: ', error);
      throw ErrHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Create Role", "Create Role");
    }

    return insertedRole;
  }

  async findAll(): Promise<object | never> {
    try {
      const roles = await this.roleRepository.find({
        where: { deletedAt: null },
      });
      return roles;
    } catch (error) {
      console.log('Error Get Roles Data: ', error);
      throw ErrHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Get Roles Data", "Get Roles");
    }
  }

  // Todo: Check if Name Equals Exist Then Throw Conflict.
  async findOne(id: string): Promise<Role | never> {
    const ifExist = await this.roleRepository.findOne({
      where: { id: id, deletedAt: null },
    });

    if (!ifExist) {
      throw ErrHandler(HttpStatus.NOT_FOUND, "Role not found!", "Find One Role but doesn't exist");
    }

    try {
      const findRole = await this.roleRepository.findOne({
        where: { id: id, deletedAt: null },
      });
      return findRole;
    } catch (error) {
      console.log('Error Find One Role: ', error);
      throw ErrHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Find One Role Data", "Find One Role");
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const ifRoleExist = await this.roleRepository.findOne({
      where: { id: id, deletedAt: null },
    });

    if (!ifRoleExist) {
      throw ErrHandler(HttpStatus.NOT_FOUND, "Role not found!", "Trying to Update Non-Existing Role");
    }

    try {
      await this.roleRepository.update({ id: id }, updateRoleDto);
      return ifRoleExist;
    } catch (error) {
      console.log('Error Update Role Data: ', error);
      throw ErrHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Update Role Data", "Update Role");
    }
  }

  async delete(id: string): Promise<object | string | never> {
    const ifExist = await this.roleRepository.findOneBy({ id: id });

    if (!ifExist) {
      throw ErrHandler(HttpStatus.NOT_FOUND, "Role not found!", "Delete Role but doesn't exist");
    }

    try {
      await this.roleRepository.update(
        { id: id },
        {
          deletedAt: new Date(),
          status: false,
        },
      );
      return 'Role has been deleted!';
    } catch (error) {
      console.log('Error Delete Role: ', error);
      throw ErrHandler(HttpStatus.NOT_FOUND, "Delete Role", "Delete Role");
    }
  }
}
