import { Router } from 'express'
import { DTO, ROLES_USERS } from '../common'
import { AuthMiddleware, ValidateMiddleware } from '../middlewares'
import {
  deleteProductController,
  findAllProductController,
  findOneProductController,
  registerProductController,
  updateProductController,
} from '../controllers'

const router = Router()
router.post(
  '/register',
  AuthMiddleware(ROLES_USERS.ADMIN),
  ValidateMiddleware(DTO.ProductRegister),
  registerProductController
)

router.put(
  '/update',
  AuthMiddleware(ROLES_USERS.ADMIN),
  ValidateMiddleware(DTO.ProductUpdate),
  updateProductController
)

router.delete(
  '/delete',
  AuthMiddleware(ROLES_USERS.ADMIN),
  ValidateMiddleware(DTO.DeleteGeneral),
  deleteProductController
)

router.get('/find-all', findAllProductController)

router.get(
  '/find-one',
  ValidateMiddleware(DTO.DeleteGeneral),
  findOneProductController
)

export default router
