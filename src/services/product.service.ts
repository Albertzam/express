import { DTO } from '../common'
import { STATUS_DB } from '../common/constants/status.db'
import { HttpException } from '../middlewares'
import { ErrorCodesApi } from '../middlewares/errors/error.constants'
import { ProductDocument, ProductModule, UserModel } from '../schemas'

class ProductService {
  async register(data: DTO.ProductRegister): Promise<ProductDocument> {
    const exist = await ProductModule.findOne({
      name: new RegExp(data.name, 'i'),
    }).lean()

    if (exist)
      throw new HttpException(
        'Product already registered',
        ErrorCodesApi.PRODUCT_ALREADY_EXISTS
      )

    const product = await ProductModule.create({
      ...data,
    }).then((ob) => ob.toObject())

    return product
  }

  async update(data: DTO.ProductUpdate): Promise<ProductDocument> {
    const exist = await ProductModule.findById(data._id)

    if (!exist)
      throw new HttpException(
        'Product not found',
        ErrorCodesApi.PRODUCT_NOT_FOUND
      )
    const productUpdated = await ProductModule.findByIdAndUpdate(data._id, {
      ...data,
    }).lean()
    return productUpdated as ProductDocument
  }

  async delete(data: DTO.DeleteGeneral): Promise<DTO.DeleteGeneral> {
    const exist = await ProductModule.findById(data._id).lean()

    if (!exist)
      throw new HttpException(
        'Product not found',
        ErrorCodesApi.PRODUCT_NOT_FOUND
      )
    else if (exist.status == STATUS_DB.ELIMINATED)
      throw new HttpException(
        'Product already deleted',
        ErrorCodesApi.PRODUCT_ALREADY_DELETED
      )

    await UserModel.findByIdAndUpdate(data._id, {
      status: STATUS_DB.ELIMINATED,
    })
    return data
  }

  async findOne(data: DTO.DeleteGeneral): Promise<ProductDocument> {
    const exist = await ProductModule.findById(data._id).exec()

    if (!exist)
      throw new HttpException(
        'Product not found',
        ErrorCodesApi.PRODUCT_NOT_FOUND
      )

    return exist
  }

  async findAll(): Promise<Array<ProductDocument>> {
    return await ProductModule.find({ status: STATUS_DB.ACTIVE }).exec()
  }
}

export default new ProductService()
