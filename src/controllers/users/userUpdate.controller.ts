import { Request, Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import userService from '../../services/user.service'

export const updateUserController = catchAsync(
  async (req: Request, res: Response) => {
    const response = await userService.update(req.body)

    res.send(response).status(HttpStatus.OK)
  }
)
