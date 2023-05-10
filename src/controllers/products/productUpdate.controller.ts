import { Request, Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import productService from '../../services/product.service'

export const updateProductController = catchAsync(
  async (req: Request, res: Response) => {
    const response = await productService.update(req.body)

    res.send(response).status(HttpStatus.OK)
  }
)
