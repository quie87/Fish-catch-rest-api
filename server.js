'use strict'

const express = require('express')
const mongoose = require('./config/mongoose.js')
const bodyParser = require('body-parser')
const logger = require('morgan')
require('dotenv').config()

const port = process.env.PORT || 3000

// Connect to the database.
mongoose.run().catch(error => {
    console.error(error)
    process.exit(1)
  })

// instantiate a express object
const app = express()

// Middleware
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

// Prevent CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authoriation")
    // Tells client what API headers are supported
    if (req.method === 'OPTIONS') {
        res.header("Acess-Control-Allow-Method", "POST, PATCH, DELETE, GET")
        return res.status(200).json({})
    }

    next()
})


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log('Press Ctrl-C to terminate...\n')
})

app.use('/', require('./api/routes/homeRouter'))
app.use('/members', require('./api/routes/membersRouter'))
app.use('/fishes', require('./api/routes/fishesRouter'))
app.use('/webhooks', require('./api/routes/webhookRouter'))

// Errors
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status(404)
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})
