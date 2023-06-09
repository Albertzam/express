import { HttpStatus } from '../../common'

export enum ErrorCodesApi {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ERROR_VALUES = 'USER_ERROR_VALUES',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  USER_ALREADY_DELETED = 'USER_ALREADY_DELETED',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_ALREADY_EXISTS = 'PRODUCT_ALREADY_EXISTS',
  PRODUCT_ALREADY_DELETED = 'PRODUCT_ALREADY_DELETED',
}

export enum GeneralErrorCodes {
  UNKNOWN = 'UNKNOWN',
  REQUEST_TIMEOUT = 'ETIMEDOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
}

export const UserErrorHttpStatus: {
  [x: string]: HttpStatus
} = {
  [ErrorCodesApi.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCodesApi.USER_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [ErrorCodesApi.USER_ALREADY_DELETED]: HttpStatus.BAD_REQUEST,
  [ErrorCodesApi.USER_ERROR_VALUES]: HttpStatus.UNAUTHORIZED,
  [ErrorCodesApi.PRODUCT_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCodesApi.PRODUCT_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [ErrorCodesApi.PRODUCT_ALREADY_DELETED]: HttpStatus.BAD_REQUEST,
}
