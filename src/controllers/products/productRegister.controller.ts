import { Request, Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import productService from '../../services/product.service'

export const registerProductController = catchAsync(
  async (req: Request, res: Response) => {
    const response = await productService.register(req.body)

    res.send(response).status(HttpStatus.CONTINUE)
  }
)
