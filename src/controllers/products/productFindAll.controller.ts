import { Request, Response } from 'express'
import { HttpStatus, PRODUCTS_KEY, catchAsync } from '../../common'
import productService from '../../services/product.service'
import { redisClient } from '../../common/redis/connect.redis'

export const findAllProductController = catchAsync(
  async (req: Request, res: Response) => {
    const existRedis = await redisClient.get(`${PRODUCTS_KEY}FIND_ALL`)
    if (existRedis) {
      res.json(JSON.parse(existRedis)).status(HttpStatus.OK)
    } else {
      const response = await productService.findAll()
      redisClient.setex(`${PRODUCTS_KEY}FIND_ALL`, 60, JSON.stringify(response))

      res.json(response).status(HttpStatus.OK)
    }
  }
)
