import { SchemaTypes, Schema, model, Document } from 'mongoose'
import { STATUS_DB } from '../common/constants/status.db'

export interface ProductDocument extends Document {
  _id: string
  name: string
  description: string
  price: number
  status: string
}

export const ProductSchema = new Schema<ProductDocument>({
  name: { type: SchemaTypes.String, required: true, upperCase: true },
  description: {
    type: SchemaTypes.String,
    required: true,
  },
  price: { type: SchemaTypes.Number, required: true },
  status: { type: SchemaTypes.String, default: STATUS_DB.ACTIVE },
})

export const ProductModule = model('product', ProductSchema)
