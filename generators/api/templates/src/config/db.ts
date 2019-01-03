/* tslint:disable no-console */
import * as mongoose from 'mongoose'

const connectOptions = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useNewUrlParser: true,
  useCreateIndex: true,
}

// // https://stackoverflow.com/a/53951290
// mongoose.connect(MONGO_URI, connectOptions)
// const db: mongoose.Connection = mongoose.connection

const connectionHandlers = (db: mongoose.Connection) => {
  // handlers
  db.on('connecting', () => {
    console.log('  MongoDB :: connecting')
  })

  db.on('error', (error) => {
    console.log(`  MongoDB :: connection ${error}`)
    mongoose.disconnect()
  })

  db.on('connected', () => {
    console.log('  MongoDB :: connected')
  })

  db.once('open', () => {
    console.log('  MongoDB :: connection opened')
  })

  db.on('reconnected', () => {
    console.log('  MongoDB :: reconnected')
  })

  db.on('reconnectFailed', () => {
    console.log('  MongoDB :: reconnectFailed')
  })

  db.on('disconnected', () => {
    console.log('  MongoDB :: disconnected')
  })

  db.on('fullsetup', () => {
    console.log('  MongoDB :: reconnecting... %d')
  })
}

export {
  connectionHandlers,
  connectOptions,
}
