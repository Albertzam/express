/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config'
import IORedis from 'ioredis'
import { logger } from '../../logger/logger'

export const url = new URL(process.env.REDIS_URL as string)

export const redisClient = new IORedis({
  host: url.hostname,
  password: url.password,
  port: Number(url.port),
})

redisClient.on('connect', () => {
  logger.debug('Redis connection established')
})

redisClient.on('error', (err: any) => {
  logger.debug(`Error connecting to Redis ${err}`)
})
