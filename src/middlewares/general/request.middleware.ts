import { Request, Response, NextFunction } from 'express'
import { logger } from '../../logger/logger'

export const requestMiddleware =
  () => (req: Request, res: Response, next: NextFunction) => {
    const { ip, method, originalUrl, query, body } = req

    logger.info('http request received', {
      network: {
        client: {
          ip,
        },
      },
      http: {
        method,
        url: originalUrl,
        query: JSON.stringify(query),
        body,
      },
    })

    res.on('close', () => {
      const { statusCode } = res
      logger.info('http request finished', {
        network: {
          client: {
            ip,
          },
        },
        http: {
          status_code: statusCode,
          url: originalUrl,
        },
      })
    })

    next()
  }
