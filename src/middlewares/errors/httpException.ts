export class HttpException extends Error {
  code: string
  public error?: Error

  constructor(message: string, code: string, stack?: string, name = 'nextia') {
    super(message)
    this.code = code
    this.name = name
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
