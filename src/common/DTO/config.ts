import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ConfigEnv {
  @IsNotEmpty()
  NODE_ENV: string

  @IsNotEmpty()
  @IsString()
  SECRET_JWT: string

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  PORT: number

  @IsNotEmpty()
  @IsString()
  MONGO_URL: string

  @IsNotEmpty()
  @IsString()
  REDIS_URL: string
}
