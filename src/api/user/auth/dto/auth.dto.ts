import { Trim } from 'class-sanitizer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @Trim()
  @IsEmail()
  public readonly email!: string;

  @IsString()
  @MinLength(8)
  public readonly password!: string;

  @IsString()
  @IsOptional()
  public readonly name!: string;

  @IsString()
  @IsOptional()
  public readonly username!: string;
}

export class OauthRegisterDto {

  @IsString()
  public readonly name!: object;

  @IsString()
  public readonly username!: string;

  @IsString()
  public readonly displayName!: string;

  @IsString()
  public readonly emails!: string[];

  @IsString()
  public readonly photos!: string[];
}

export class LoginDto {
  @Trim()
  @IsEmail()
  @IsNotEmpty()
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}
