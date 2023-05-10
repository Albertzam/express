import { Request, Response } from 'express'
import { DTO, HttpStatus, PRODUCTS_KEY, catchAsync } from '../../common'
import productService from '../../services/product.service'
import { redisClient } from '../../common/redis/connect.redis'

export const findOneProductController = catchAsync(
  async (
    req: Request<object, object, object, DTO.DeleteGeneral>,
    res: Response
  ) => {
    const existRedis = await redisClient.get(`${PRODUCTS_KEY}${req.query._id}`)
    if (existRedis) {
      res.json(JSON.parse(existRedis)).status(HttpStatus.OK)
    } else {
      const response = await productService.findOne(req.query)
      redisClient.setex(
        `${PRODUCTS_KEY}${req.query._id}`,
        60,
        JSON.stringify(response)
      )

      res.json(response).status(HttpStatus.OK)
    }
  }
)
