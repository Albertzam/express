/* eslint-disable no-case-declarations */
import dotenv from 'dotenv'
import { DTO } from './common'
import { validate } from 'class-validator'

import fs from 'fs'
import { plainToInstance } from 'class-transformer'
export class Config {
  async getEnv(): Promise<void> {
    let envObject
    const errors: Array<string> = []
    switch (process.env.NODE_ENV) {
      case 'dev':
        const envContent = fs.readFileSync('.env')
        envObject = dotenv.parse(envContent)
        break
      case 'production':
        envObject = { ...process.env }
    }

    const validateEnv = await validate(
      plainToInstance(DTO.ConfigEnv, envObject)
    )
    if (validateEnv.length > 0) {
      validateEnv.forEach((error) =>
        errors.push(
          ...Object.values(
            error.constraints as {
              [type: string]: string
            }
          )
        )
      )

      throw new Error(`.env is missing variables ${JSON.stringify(errors)}`)
    }
  }
}

export const config = new Config()
