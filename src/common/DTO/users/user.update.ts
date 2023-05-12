import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator'
import { ROLES_USERS } from '../../constants/roles.constants'

export class UserUpdate {
  @IsNotEmpty()
  @IsMongoId()
  _id: string

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
  @IsEnum(ROLES_USERS, { each: true })
  roles: Array<string>
}
