import { Router } from 'express'
import { DTO } from '../common'
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
  AuthMiddleware('ADMIN'),
  ValidateMiddleware(DTO.ProductRegister),
  registerProductController
)

router.put(
  '/update',
  AuthMiddleware('ADMIN'),
  ValidateMiddleware(DTO.ProductUpdate),
  updateProductController
)

router.delete(
  '/delete',
  AuthMiddleware('ADMIN'),
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
