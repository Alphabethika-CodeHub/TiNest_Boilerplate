import { Injectable, ExecutionContext, CanActivate, Type } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@/api/user/entity/user.entity';

export function RoleGuard(role: string): Type<CanActivate> {
  @Injectable()
  class RoleGuard extends AuthGuard('jwt') implements IAuthGuard {
    public handleRequest(err: unknown, user: User): any {
      return user;
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const { user }: Request = context.switchToHttp().getRequest();
      // console.log("AUTH GUARD HITTED: ", user["role"].name);

      // Check User Role if Match And Status is True,
      // If Equal to True Then Authorise The User.
      if (user && user["role"].name && user["role"].status === true) {
        return user["role"].name === role;
      }

      return false;
    }
  }

  return RoleGuard;
}
