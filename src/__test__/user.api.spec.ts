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
  REGISTER_USER,
  RESPONSE_USER,
  ROLES_USERS,
  UPDATE_USER,
  catchAsync,
} from '../common'
import {
  AuthMiddleware,
  ErrorMiddleware,
  ValidateMiddleware,
} from '../middlewares'
import { RequestTest } from './request'
import * as jwt from 'jsonwebtoken'
import helmet from 'helmet'

describe('User api test', () => {
  let appExpress: Express
  let appListen: http.Server
  let requestTest: RequestTest
  const userService = {
    register: jest.fn(),
    login: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  const userController = {
    register: catchAsync(
      jest.fn(async (req: Request, res: Response) => {
        res.json(await userService.register(req.body)).status(HttpStatus.OK)
      })
    ),
    update: catchAsync(
      jest.fn(async (req: Request, res: Response) => {
        res.json(await userService.update(req.body)).status(HttpStatus.OK)
      })
    ),
    login: catchAsync(
      jest.fn(async (req: Request, res: Response) => {
        res.json(await userService.login(req.body)).status(HttpStatus.OK)
      })
    ),
    delete: catchAsync(
      jest.fn(async (req: Request, res: Response) => {
        res.json(await userService.delete(req.query)).status(HttpStatus.OK)
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
      '/user/register',
      ValidateMiddleware(DTO.UserRegister),
      userController.register
    )

    appExpress.put(
      '/user/update',
      AuthMiddleware('ADMIN'),
      ValidateMiddleware(DTO.UserUpdate),
      userController.update
    )

    appExpress.delete(
      '/user/delete',
      AuthMiddleware('ADMIN'),
      ValidateMiddleware(DTO.DeleteGeneral),
      userController.delete
    )

    appExpress.post(
      '/user/login',
      ValidateMiddleware(DTO.UserLogin),
      userController.login
    )

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

  describe('Api user', () => {
    beforeEach(() => {
      userService.register.mockReset()
      userService.register.mockReturnValueOnce(RESPONSE_USER)
      userService.login.mockReset()
      userService.login.mockReturnValueOnce(RESPONSE_USER)
      userService.update.mockReset()
      userService.update.mockReturnValueOnce(RESPONSE_USER)
      userService.delete.mockReset()
      userService.delete.mockReturnValue(ID_GENERAL)
    })

    describe('Register user', () => {
      it('should register new user ', async () => {
        await requestTest
          .postAuthorizedCall('/user/register', REGISTER_USER)
          .expect(200)
          .expect(RESPONSE_USER)
      })

      it('should register with missing values', async () => {
        await requestTest
          .postAuthorizedCall('/user/register', {})
          .expect(400)
          .expect({
            code: 400,
            name: 'class-validator',
            message: [
              'userName must be longer than or equal to 5 characters',
              'userName must be a string',
              'userName should not be empty',
              'email must be an email',
              'email should not be empty',
              'password must be a string',
              'password should not be empty',
              'each value in roles must be one of the following values: ADMIN, USER',
              'roles should not be empty',
            ],
          })
      })
    })

    describe('Update user', () => {
      it('should update user ', async () => {
        await requestTest
          .putAuthorizedCall('/user/update', UPDATE_USER)
          .expect(200)
          .expect(RESPONSE_USER)
      })

      it('should update user unauthorized', async () => {
        await requestTest
          .putUnauthorizedCall('/user/update', UPDATE_USER)
          .expect(401)
      })
      it('should register with missing values', async () => {
        await requestTest
          .putAuthorizedCall('/user/update', {})
          .expect(400)
          .expect({
            code: 400,
            name: 'class-validator',
            message: [
              '_id must be a mongodb id',
              '_id should not be empty',
              'userName must be longer than or equal to 5 characters',
              'userName must be a string',
              'userName should not be empty',
              'email must be an email',
              'email should not be empty',
              'password must be a string',
              'password should not be empty',
              'each value in roles must be one of the following values: ADMIN, USER',
              'roles should not be empty',
            ],
          })
      })
    })

    describe('Delete user', () => {
      it('should delete user ', async () => {
        await requestTest
          .deleteAuthorizedCall('/user/delete', ID_GENERAL)
          .expect(200)
          .expect(ID_GENERAL)
      })

      it('should delete user unauthorized', async () => {
        await requestTest
          .deleteUnAuthorizedCall('/user/delete', ID_GENERAL)
          .expect(401)
      })
      it('should delete with missing values', async () => {
        await requestTest
          .deleteAuthorizedCall('/user/delete', {})
          .expect(400)
          .expect({
            code: 400,
            name: 'class-validator',
            message: ['_id should not be empty', '_id must be a mongodb id'],
          })
      })
    })

    describe('Login user', () => {
      it('should login user ', async () => {
        await requestTest
          .postAuthorizedCall('/user/login', LOGIN_USER)
          .expect(200)
          .expect(RESPONSE_USER)
      })

      it('should login with missing values', async () => {
        await requestTest
          .postAuthorizedCall('/user/login', {})
          .expect(400)
          .expect({
            code: 400,
            name: 'class-validator',
            message: [
              'email must be an email',
              'email should not be empty',
              'password must be a string',
              'password should not be empty',
            ],
          })
      })
    })
  })
})
