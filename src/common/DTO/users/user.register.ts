import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UserRegister {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  userName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString({ each: true })
  roles: Array<string>
}
