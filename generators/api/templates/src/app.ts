import * as dotenv from 'dotenv'
dotenv.config()

import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as express from 'express'
import * as helmet from 'helmet'
import * as mongoose from 'mongoose'
import * as morgan from 'morgan'
import * as passport from 'passport'
import authRouter from './api/auth'
import graphqlRouter from './api/graphql'
import Cron from './config/cron'
import { connectionHandlers, connectOptions } from './config/db'
import { HttpError } from './config/errorHandler'
import httpErrorModule from './config/errorHandler/sendHttpError'

const app = express()

// db
const MONGO_URI: string = `${process.env.MONGO_URI}`
mongoose.connect(MONGO_URI, connectOptions)
const db: mongoose.Connection = mongoose.connection
connectionHandlers(db)

// cron
Cron.init()

// express
app.set('env', process.env.NODE_ENV || 'development')
app.set('port', process.env.PORT || 3000)

// middleware
app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())

// error handler
app.use(httpErrorModule)
app.use((error: Error, req: express.Request, res: any, next: express.NextFunction) => {
  if (typeof error === 'number') {
    error = new HttpError(error) // next(404)
  }

  if (error instanceof HttpError) {
    res.sendHttpError(error)
  } else {
    if (app.get('env') === 'development') {
      error = new HttpError(500, error.message)
      res.sendHttpError(error)
    } else {
      error = new HttpError(500)
      res.sendHttpError(error, error.message)
    }
}
})

// use morgan in development
if (app.get('env') === 'development') {
  app.use(morgan('tiny'))
}

// routes
app.use('/auth', authRouter)
app.use('/graphql', graphqlRouter)

export default app
