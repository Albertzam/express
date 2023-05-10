import { Router } from 'express'
import { DTO } from '../common'
import { AuthMiddleware, ValidateMiddleware } from '../middlewares'
import {
  deleteUserController,
  loginUserController,
  registerUserController,
  updateUserController,
} from '../controllers'

const router = Router()
router.post(
  '/register',
  ValidateMiddleware(DTO.UserRegister),
  registerUserController
)

router.put(
  '/update',
  AuthMiddleware('ADMIN'),
  ValidateMiddleware(DTO.UserUpdate),
  updateUserController
)

router.delete(
  '/delete',
  AuthMiddleware('ADMIN'),
  ValidateMiddleware(DTO.DeleteGeneral),
  deleteUserController
)

router.post('/login', ValidateMiddleware(DTO.UserLogin), loginUserController)
export default router
