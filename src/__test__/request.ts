/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
import request from 'supertest'
import { Express } from 'express'

export class RequestTest {
  private app: Express
  private jwtToken: string
  constructor(app: Express, jwtToken: string) {
    this.app = app
    this.jwtToken = jwtToken
  }

  postUnAuthorizedCall = <T extends string, K extends object>(
    path: T,
    body: K
  ) => request(this.app).post(path).send(body)

  postAuthorizedCall = <T extends string, K extends object>(path: T, body: K) =>
    this.postUnAuthorizedCall(path, body).set(
      'Authorization',
      `Bearer ${this.jwtToken}`
    )

  getUnAuthorizedCall = <T extends string, K>(path: T, param?: K) =>
    request(this.app)
      .get(path)
      .query(param as object)

  getAuthorizedCall = <T extends string, K>(path: T, param?: K) =>
    this.getUnAuthorizedCall(path, param).set(
      'Authorization',
      `Bearer ${this.jwtToken}`
    )

  putAuthorizedCall = <T extends string, K extends object>(path: T, body: K) =>
    this.putUnauthorizedCall(path, body).set(
      'Authorization',
      `Bearer ${this.jwtToken}`
    )
  putUnauthorizedCall = <T extends string, K extends object>(
    path: T,
    body: K
  ) => request(this.app).put(path).send(body)

  deleteUnAuthorizedCall = <T extends string, K = any>(path: T, param?: K) =>
    request(this.app)
      .delete(path)
      .query(param as any)
  deleteAuthorizedCall = <T extends string, K = any>(path: T, param?: K) =>
    this.deleteUnAuthorizedCall(path, param).set(
      'Authorization',
      `Bearer ${this.jwtToken}`
    )
}
