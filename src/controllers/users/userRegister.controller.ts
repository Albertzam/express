import { Request, Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import userService from '../../services/user.service'

export const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const response = await userService.register(req.body)

    res.send(response).status(HttpStatus.CONTINUE)
  }
)
