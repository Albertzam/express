import { Router } from 'express'
import { DTO, ROLES_USERS } from '../common'
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
  AuthMiddleware(ROLES_USERS.ADMIN),
  ValidateMiddleware(DTO.UserUpdate),
  updateUserController
)

router.delete(
  '/delete',
  AuthMiddleware(ROLES_USERS.ADMIN),
  ValidateMiddleware(DTO.DeleteGeneral),
  deleteUserController
)

router.post('/login', ValidateMiddleware(DTO.UserLogin), loginUserController)
export default router
