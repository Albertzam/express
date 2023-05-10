import { Request, Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import userService from '../../services/user.service'

export const loginUserController = catchAsync(
  async (req: Request, res: Response) => {
    const response = await userService.login(req.body)

    res.json(response).status(HttpStatus.CONTINUE)
  }
)
