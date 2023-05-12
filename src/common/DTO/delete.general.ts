import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator'

export class DeleteGeneral {
  @IsMongoId()
  @IsNotEmpty()
  _id: string
}
