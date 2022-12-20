import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common/decorators';
import { Request, Response } from 'express';
import { AuthService } from '../../auth.service';
import { GoogleOauthGuard } from './google_oauth.guard';

@Controller('auth/google')
export class GoogleOauthController {
    constructor(private authService: AuthService) { }

    @Get('/')
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Req() _req) { }

    @Get('/redirect')
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        // Redirected to Index HBS at App Controller
    }

}