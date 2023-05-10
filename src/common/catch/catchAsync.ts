/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
export const catchAsync =
  (fn: any) =>
  (_req: Request, _res: Response, _next: NextFunction): void => {
    Promise.resolve(fn(_req, _res, _next)).catch((err) => {
      _next(err)
    })
  }
