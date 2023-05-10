/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { HttpException } from '../errors/httpException'
import { GeneralErrorCodes } from '../errors/error.constants'

export const AuthMiddleware = (...roles: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null)
      next(
        new HttpException('User not authorized', GeneralErrorCodes.UNAUTHORIZED)
      )
    else {
      jwt.verify(
        token,
        process.env.SECRET_JWT as string,
        (err: any, user: any) => {
          if (err) {
            next(
              new HttpException(
                'User not authorized',
                GeneralErrorCodes.UNAUTHORIZED
              )
            )
          } else {
            let existRol = false

            roles.forEach((rol) => {
              if (user.roles.includes(rol)) existRol = true
            })

            if (!existRol)
              next(
                new HttpException(
                  'Route Forbidden',
                  GeneralErrorCodes.FORBIDDEN
                )
              )

            next()
          }
        }
      )
    }
  }
}
