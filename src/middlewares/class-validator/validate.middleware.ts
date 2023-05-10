import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { BadRequest } from '../errors/class-validator'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ValidateMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = Object.assign(
      new dtoClass(),
      req.method.toLowerCase() == 'get' ? req.query : req.body
    )

    const errores = await validate(dtoInstance)

    if (errores.length > 0) {
      const mensajesErrores: string[] = []
      errores.forEach((error) =>
        mensajesErrores.push(
          ...Object.values(
            error.constraints as {
              [type: string]: string
            }
          )
        )
      )
      next(new BadRequest(mensajesErrores))
    }

    next()
  }
}
