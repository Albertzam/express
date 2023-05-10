import { Request, Response } from 'express'
import { DTO, HttpStatus, catchAsync } from '../../common'
import userService from '../../services/user.service'

export const deleteUserController = catchAsync(
  async (
    req: Request<object, object, object, DTO.DeleteGeneral>,
    res: Response
  ) => {
    const response = await userService.delete(req.query)

    res.send(response).status(HttpStatus.OK)
  }
)
