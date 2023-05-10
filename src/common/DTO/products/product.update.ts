import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator'

export class ProductUpdate {
  @IsNotEmpty()
  @IsMongoId()
  _id: string

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  name: string

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  description: string

  @IsNotEmpty()
  @IsNumber()
  @Min(5)
  @Max(99999)
  price: number
}
