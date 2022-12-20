import { ClassSerializerInterceptor, Controller, Get, Render, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { GoogleOauthGuard } from './api/user/auth/oauth2/google/google_oauth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/index-hbs")
  @UseGuards(GoogleOauthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Render("index")
  indexHbsPage(@Req() req: Request, @Res() res: Response): object {
    return { message: "Index of Hbs" }
  }
}
