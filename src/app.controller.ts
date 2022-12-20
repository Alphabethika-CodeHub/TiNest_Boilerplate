import { ClassSerializerInterceptor, Controller, Get, Render, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/index-hbs")
  @UseInterceptors(ClassSerializerInterceptor)
  @Render("index")
  indexHbsPage(@Req() req: Request, @Res() res: Response): object {
    return { message: "Index of Hbs" }
  }
}
