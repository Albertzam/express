import mongoose from 'mongoose'
import { ROLES_USERS } from './roles.constants'
import { STATUS_DB } from './status.db'

const test = 'testing'
const email = 'test@test.com'
const _id = new mongoose.Types.ObjectId().toString()

export const EMAIL_JWT = email
export const REGISTER_USER = {
  userName: test,
  email: email,
  password: test,
  roles: [ROLES_USERS.ADMIN],
}

export const RESPONSE_USER = {
  _id: _id,
  userName: test,
  email: email,
  status: STATUS_DB.ACTIVE,
  roles: [ROLES_USERS.ADMIN],
  token: test,
}

export const UPDATE_USER = {
  _id: _id,
  userName: test,
  email: email,
  password: test,
  roles: [ROLES_USERS.ADMIN],
}

export const ID_GENERAL = {
  _id: _id,
}

export const LOGIN_USER = {
  email: email,
  password: test,
}

export const REGISTER_PRODUCT = {
  name: test,
  description: test,
  price: 100,
}

export const UPDATE_PRODUCT = {
  name: test,
  description: test,
  price: 100,
  _id: _id,
}

export const RESPONSE_PRODUCT = {
  name: test,
  description: test,
  price: 100,
  _id: _id,
  status: test,
}
