import { Request, Response } from 'express'
import { DTO, HttpStatus, catchAsync } from '../../common'
import productService from '../../services/product.service'

export const deleteProductController = catchAsync(
  async (
    req: Request<object, object, object, DTO.DeleteGeneral>,
    res: Response
  ) => {
    const response = await productService.delete(req.query)

    res.send(response).status(HttpStatus.OK)
  }
)
