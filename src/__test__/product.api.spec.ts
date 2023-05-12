/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config'
import * as http from 'http'
import express, { NextFunction, Request, Response, Express } from 'express'
import {
  DTO,
  EMAIL_JWT,
  HttpStatus,
  ID_GENERAL,
  LOGIN_USER,
  REGISTER_PRODUCT,
  RESPONSE_PRODUCT,
  ROLES_USERS,
  UPDATE_PRODUCT,
  catchAsync,
} from '../common'
import { RequestTest } from './request'
import {
  AuthMiddleware,
  ErrorMiddleware,
  ValidateMiddleware,
} from '../middlewares'
import * as jwt from 'jsonwebtoken'
import helmet from 'helmet'

describe('User api test', () => {
  let appExpress: Express
  let appListen: http.Server
  let requestTest: RequestTest
  const productService = {
    register: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
  const productController = {
    register: catchAsync(
      jest.fn(async (req: Request, res: Response) => {
        res.json(await productService.register(req.body)).status(HttpStatus.OK)
      })
    ),
    update: catchAsync(
      jest.fn(async (req: Request, res: Response) => {
        res.json(await productService.update(req.body)).status(HttpStatus.OK)
      })
    ),
    findOne: catchAsync(
      jest.fn(async (req: Request, res: Response) => {
        res.json(await productService.findOne(req.query)).status(HttpStatus.OK)
      })
    ),
    findAll: catchAsync(
      jest.fn(async (req: Request, res: Response) => {
        res.json(await productService.findAll()).status(HttpStatus.OK)
      })
    ),
    delete: catchAsync(
      jest.fn(async (req: Request, res: Response) => {
        res.json(await productService.delete(req.query)).status(HttpStatus.OK)
      })
    ),
  }

  beforeAll(async () => {
    appExpress = express()
    const errorMiddleware = new ErrorMiddleware()
    appExpress.use(express.urlencoded({ extended: true }))
    appExpress.use(express.json())
    appExpress.use(helmet())

    appExpress.post(
      '/product/register',
      AuthMiddleware('ADMIN'),
      ValidateMiddleware(DTO.ProductRegister),
      productController.register
    )

    appExpress.put(
      '/product/update',
      AuthMiddleware('ADMIN'),
      ValidateMiddleware(DTO.ProductUpdate),
      productController.update
    )

    appExpress.delete(
      '/product/delete',
      AuthMiddleware('ADMIN'),
      ValidateMiddleware(DTO.DeleteGeneral),
      productController.delete
    )

    appExpress.get(
      '/product/find-one',
      ValidateMiddleware(DTO.DeleteGeneral),
      productController.findOne
    )

    appExpress.get('/product/find-all', productController.findAll)

    appExpress.use(
      (error: any, req: Request, res: Response, next: NextFunction) =>
        errorMiddleware.handleError(error, req, res, next)
    )
    const accessToken = jwt.sign(
      { email: EMAIL_JWT, roles: [ROLES_USERS.ADMIN] },
      process.env.SECRET_JWT as string,
      {
        expiresIn: '12h',
      }
    )
    appListen = appExpress.listen(0)
    requestTest = new RequestTest(appExpress, accessToken)
  })

  afterAll(() => {
    appListen.close()
  })

  describe('Api product', () => {
    beforeEach(() => {
      productService.register.mockReset()
      productService.register.mockReturnValueOnce(RESPONSE_PRODUCT)
      productService.findOne.mockReset()
      productService.findOne.mockReturnValueOnce(RESPONSE_PRODUCT)
      productService.findAll.mockReset()
      productService.findAll.mockReturnValueOnce([RESPONSE_PRODUCT])
      productService.update.mockReset()
      productService.update.mockReturnValueOnce(RESPONSE_PRODUCT)
      productService.delete.mockReset()
      productService.delete.mockReturnValue(ID_GENERAL)
    })

    describe('Register product', () => {
      it('should register new product ', async () => {
        await requestTest
          .postAuthorizedCall('/product/register', REGISTER_PRODUCT)
          .expect(200)
          .expect(RESPONSE_PRODUCT)
      })

      it('should register with missing values', async () => {
        await requestTest
          .postAuthorizedCall('/product/register', {})
          .expect(400)
          .expect({
            code: 400,
            name: 'class-validator',
            message: [
              'name must be longer than or equal to 5 characters',
              'name must be a string',
              'name should not be empty',
              'description must be longer than or equal to 5 characters',
              'description must be a string',
              'description should not be empty',
              'price must not be greater than 99999',
              'price must not be less than 5',
              'price must be a number conforming to the specified constraints',
              'price should not be empty',
            ],
          })
      })
    })

    describe('Update product', () => {
      it('should update product ', async () => {
        await requestTest
          .putAuthorizedCall('/product/update', UPDATE_PRODUCT)
          .expect(200)
          .expect(RESPONSE_PRODUCT)
      })

      it('should update product unauthorized', async () => {
        await requestTest
          .putUnauthorizedCall('/product/update', UPDATE_PRODUCT)
          .expect(401)
      })
      it('should register with missing values', async () => {
        await requestTest
          .putAuthorizedCall('/product/update', {})
          .expect(400)
          .expect({
            code: 400,
            name: 'class-validator',
            message: [
              '_id must be a mongodb id',
              '_id should not be empty',
              'name must be longer than or equal to 5 characters',
              'name must be a string',
              'name should not be empty',
              'description must be longer than or equal to 5 characters',
              'description must be a string',
              'description should not be empty',
              'price must not be greater than 99999',
              'price must not be less than 5',
              'price must be a number conforming to the specified constraints',
              'price should not be empty',
            ],
          })
      })
    })

    describe('Delete product', () => {
      it('should delete product ', async () => {
        await requestTest
          .deleteAuthorizedCall('/product/delete', ID_GENERAL)
          .expect(200)
          .expect(ID_GENERAL)
      })

      it('should delete product unauthorized', async () => {
        await requestTest
          .deleteUnAuthorizedCall('/product/delete', ID_GENERAL)
          .expect(401)
      })
      it('should delete with missing values', async () => {
        await requestTest
          .deleteAuthorizedCall('/product/delete', {})
          .expect(400)
          .expect({
            code: 400,
            name: 'class-validator',
            message: ['_id should not be empty', '_id must be a mongodb id'],
          })
      })
    })

    describe('Find one product', () => {
      it('should find one product ', async () => {
        await requestTest
          .getUnAuthorizedCall('/product/find-one', ID_GENERAL)
          .expect(200)
          .expect(RESPONSE_PRODUCT)
      })

      it('should find one with missing values', async () => {
        await requestTest
          .getUnAuthorizedCall('/product/find-one', {})
          .expect(400)
          .expect({
            code: 400,
            name: 'class-validator',
            message: ['_id should not be empty', '_id must be a mongodb id'],
          })
      })
    })

    describe('Find all product', () => {
      it('should find all product ', async () => {
        await requestTest
          .getUnAuthorizedCall('/product/find-all', LOGIN_USER)
          .expect(200)
          .expect([RESPONSE_PRODUCT])
      })
    })
  })
})
