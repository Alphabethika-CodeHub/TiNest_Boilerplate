import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { UpdateNameDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class UserService {
  public constructor(
    @InjectSentry() private readonly client: SentryService
  ) { }

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async getUsers(): Promise<object | never> {
    try {
      const users = await this.userRepository.find({
        where: { deletedAt: null },
      });
      return {
        data: users,
      };
    } catch (error) {
      console.log('Error: ', error);

      // Using Sentry to Throw Error
      this.client.instance().captureMessage("Hit Get Users", "warning");
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: `Error`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneUser(id): Promise<object | never> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id: id, deletedAt: null },
        relations: ['role'],
      });
      return user;
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: `User Not Found!`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateUser(body: UpdateNameDto, req: Request): Promise<User> {
    try {
      const user: User = <User>req.user;
      user.name = body.name;
      return this.userRepository.save(user);
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: `Error`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: string) {
    try {

      const isUserAdmin = await this.userRepository.findOneBy({ id })

      if (!isUserAdmin) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User Not Found!',
          },
          HttpStatus.NOT_FOUND,
        );
      } else if (isUserAdmin.name === "Admin") {
        return {
          message: "Admin Cannot be Deleted."
        };
      }

      return await this.userRepository.softDelete(id)

    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: `Error`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
