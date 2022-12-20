import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../../auth.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ) {
        super({
            clientID: configService.get<string>("OAUTH_GOOGLE_ID"),
            clientSecret: configService.get<string>("OAUTH_GOOGLE_SECRET"),
            callbackURL: configService.get<string>("OAUTH_GOOGLE_REDIRECT_URL"),
            scope: ["email", "profile"]
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile
    ) {
        // const { id, name, emails } = profile
        // return {
        //     provider: 'google',
        //     providerId: id,
        //     name: name.givenName,
        //     username: emails[0].value,
        //     profile: profile
        // };

        await this.authService.register({ email: '', password: '', name: '', username: '' }, "google", profile);
    }

}