import { HttpStatus } from '../../common'

export class BadRequest extends Error {
  public code: number

  constructor(message: Array<string>) {
    super(JSON.stringify(message))
    this.code = HttpStatus.BAD_REQUEST
    this.name = 'class-validator'
  }
}
