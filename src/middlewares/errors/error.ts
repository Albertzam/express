/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../../common'
import { logger } from '../../logger/logger'
import { GeneralErrorCodes, UserErrorHttpStatus } from './error.constants'

import { HttpException } from './httpException'
import { coerceNextiaError } from './coerseError'
import { BadRequest } from './class-validator'

export class ErrorMiddleware {
  private ERROR_CODE_MAPS = new Map<string, HttpStatus>([
    [GeneralErrorCodes.UNKNOWN, HttpStatus.INTERNAL_SERVER_ERROR],
    [GeneralErrorCodes.REQUEST_TIMEOUT, HttpStatus.REQUEST_TIMEOUT],
    [GeneralErrorCodes.UNAUTHORIZED, HttpStatus.UNAUTHORIZED],
    [GeneralErrorCodes.FORBIDDEN, HttpStatus.FORBIDDEN],
  ])

  constructor() {
    for (const key of Object.keys(UserErrorHttpStatus)) {
      this.registerErrorCodeMap(key, UserErrorHttpStatus[key])
    }
  }

  registerErrorCodeMap(code: string, status: HttpStatus): void {
    if (this.ERROR_CODE_MAPS.has(code)) {
      throw new Error(`Error code ${code} already registered`)
    }
    logger.info(`register code ${code} status ${status}`)
    this.ERROR_CODE_MAPS.set(code, status)
  }

  getStatusFromErrorCode(code: string): HttpStatus {
    if (!this.ERROR_CODE_MAPS.has(code)) {
      return HttpStatus.INTERNAL_SERVER_ERROR
    } else {
      return this.ERROR_CODE_MAPS.get(code) as HttpStatus
    }
  }
  private getHttpStatus(code: string): HttpStatus {
    return this.getStatusFromErrorCode(code)
  }

  handleError(
    error: Error | HttpException,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error.name !== 'class-validator') {
      const nextiaError = coerceNextiaError(error)

      const status = this.getHttpStatus(nextiaError?.code)
      logger.error(`${error.message}`, {
        error: {
          code: nextiaError.code,
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        remote_error: nextiaError.error
          ? {
              message: nextiaError.error.message,
              stack: nextiaError.error.stack,
              name: nextiaError.error.name,
            }
          : undefined,
      })
      res.status(status).json({
        code: nextiaError.code,
        message: nextiaError.message,
      })
    } else if (error.name == 'class-validator') {
      const badRequest = error as BadRequest
      logger.error('Bad Request', {
        http: { status_code: badRequest.code },
        error: {
          name: badRequest.name,
          message: JSON.parse(badRequest.message),
          stack: badRequest.stack,
          status: badRequest.code,
        },
      })
      res
        .status(badRequest.code)
        .json({ ...badRequest, message: JSON.parse(badRequest.message) })
    }
  }
}
