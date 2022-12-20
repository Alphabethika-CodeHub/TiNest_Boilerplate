import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/api/user/entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto, OauthRegisterDto } from './dto/auth.dto';
import { AuthHelper } from './auth.helper';
import { Role } from '@/api/role/entities/role.entity';
import { RoleService } from './../../role/role.service';
import { templateLoader } from '@/common/helper/templateLoader';
import { differenceInMinutes } from 'date-fns';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { EmailService } from '@/api/email/email.service';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Inject( // Using ForwardRef to Avoid Circular Dependency.
    forwardRef(() => {
      return RoleService
    })
  )
  private readonly roleService: RoleService

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(body: RegisterDto, registerType: string, objectData: OauthRegisterDto): Promise<object | never> {
    let registeredData;

    const { username, name, email, password }: RegisterDto = body;
    let user: User = await this.repository.findOne({ where: { email } });
    const adminRole: Role = await this.roleService.findOne("efc628f6-73c8-43c4-b655-459865dc262d");
    const verificationCode = randomStringGenerator();

    if (registerType === "app") {

      if (user) {
        throw new HttpException('Conflict', HttpStatus.CONFLICT);
      }

      let userData = new User();
      userData.name = name;
      userData.email = email;
      userData.username = username;
      userData.password = this.helper.encodePassword(password);
      userData.role = adminRole;
      userData.verification_email_code = verificationCode

      await this.repository.insert(userData);

      await this.sendRegistrationEmail({
        name: userData.name,
        verificationCode,
        id: userData.id,
        email: userData.email,
      });

      // Set userData
      registeredData = userData
    } else if (registerType === "google" || registerType === "github" || registerType === "linkedin") {

      if (user) {
        throw new HttpException('Conflict', HttpStatus.CONFLICT);
      }

      // let userData = new User();
      // userData.name = objectData.name;
      // userData.email = objectData.emails[0].;
      // userData.username = username;
      // userData.role = adminRole;
      // userData.verification_email_code = verificationCode
      // userData.verification_email_status = verificationCode
      // userData.social_media_login = registerType

      // await this.repository.insert(userData);

      // await this.sendRegistrationEmail({
      //   name: userData.name,
      //   verificationCode,
      //   id: userData.id,
      //   email: userData.email,
      // });

      // Set userData
      // registeredData = userData
    }

    return registeredData

  }

  public async login(body: LoginDto): Promise<object | never> {
    try {
      const { email, password }: LoginDto = body;
      const user: User = await this.repository.findOne({ where: { email } });

      if (!user) {
        throw new HttpException('No user found', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid: boolean = this.helper.isPasswordValid(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new HttpException('No user found', HttpStatus.NOT_FOUND);
      }

      this.repository.update(user.id, { lastLoginAt: new Date() });

      return {
        token: await this.helper.generateToken(user),
      };
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

  public async refresh(user: User): Promise<string> {
    this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.helper.generateToken(user);
  }

  public async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.repository
        .createQueryBuilder("user")
        .where(`user.name ilike '%${email}%'`)
        .getOne();
      return user
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

  async sendRegistrationEmail(member: {
    name: string;
    verificationCode: string;
    id: string;
    email: string;
  }): Promise<void> {
    const { name, verificationCode, id, email } = member;

    const html = await templateLoader('email-verify.html', {
      name: name,
      link: `${process.env.FRONTEND_APP_URL}/verification_email?code=${verificationCode}`,
      be_url: process.env.BACKEND_APP_URL,
    });

    await this.emailService.send({
      to: email,
      subject: 'Verify Your GS Account',
      body: html,
    });

    // await this.partialUpdate(id, { last_registration_email_send: new Date() });
  }

  async resendEmailRegistration(user_email: string): Promise<void> {
    const user = await this.findOneByEmail(user_email);
    const { name, verification_email_code, email, id } = user;

    if (user.last_registration_email_send) {
      const isBefore2Minutes =
        differenceInMinutes(
          new Date(),
          new Date(user.last_registration_email_send),
        ) <= 2;

      if (isBefore2Minutes) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_ACCEPTABLE,
            message: 'You have already sent email verification code',
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    }

    await this.sendRegistrationEmail({
      name,
      email,
      id,
      verificationCode: verification_email_code,
    });
  }
}
