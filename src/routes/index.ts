import { Router } from 'express'
import userRoutes from './user.routes'
import productsRoutes from './product.routes'
export default (router: Router) => {
  router.use('/user', userRoutes)
  router.use('/product', productsRoutes)
}
