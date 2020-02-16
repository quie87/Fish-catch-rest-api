'use strict'

const mongoose = require('mongoose')

/**
 * Establishes a connection to a database.
 *
 * @returns {Promise}
*/
module.exports.run = async () => {
  mongoose.Promise = global.Promise

  mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
  mongoose.connection.on('error', err => console.error(`Mongoose connection error has occured: ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

  // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination.')
      process.exit(0)
    })
  })

  // Connect to the server.
  return mongoose.connect(process.env.DB_KEY, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}
