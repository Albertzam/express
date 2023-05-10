import { SchemaTypes, model, Document, Schema } from 'mongoose'
import { STATUS_DB } from '../common/constants/status.db'

export interface UserDocument extends Document {
  _id: string
  userName: string
  email: string
  password: string
  roles: Array<string>
  status: string
}

export const UserSchema = new Schema<UserDocument>({
  userName: { type: SchemaTypes.String, required: true, upperCase: true },
  email: {
    type: SchemaTypes.String,
    required: true,
    lowerCase: true,
    unique: true,
  },
  password: { type: SchemaTypes.String, required: true },
  roles: { type: [SchemaTypes.String], required: true },
  status: { type: SchemaTypes.String, default: STATUS_DB.ACTIVE },
})

export const UserModel = model<UserDocument>('User', UserSchema)
