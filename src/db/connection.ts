import mongoose, { Connection, Mongoose } from 'mongoose'
import { logger } from '../logger/logger'

export class ConnectionDb {
  private connection: Connection
  private mongoose: Mongoose

  async connect(): Promise<void> {
    try {
      this.mongoose = mongoose
      await this.mongoose.connect(process.env.MONGO_URL as string)
      this.connection = this.mongoose.connection
      logger.info('Database connected')
    } catch (err) {
      logger.error(
        `Error connecting to database ${process.env.MONGO_URL} ${err}`
      )
      process.exit(1)
    }
  }

  disconnect(): void {
    if (this.connection) {
      this.connection.close()
      logger.info('Database disconnect')
    }
  }

  getConnection(): Connection {
    if (!this.mongoose.connection) {
      throw new Error('Dont connect to database')
    }
    return this.mongoose.connection
  }
}

const db = new ConnectionDb()

export default db
