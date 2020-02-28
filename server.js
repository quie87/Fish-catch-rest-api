const express = require('express')
const mongoose = require('./config/mongoose.js')
const bodyParser = require('body-parser')
const logger = require('morgan')
require('dotenv').config()

'use strict'

const port = process.env.PORT || 3000

// Connect to the database.
mongoose.run().catch(error => {
    console.error(error)
    process.exit(1)
  })

const app = express()

// Middleware
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Prevent CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization, x-auth-token")
    res.header({"X-Content-Type-Options": 'nosniff'})
    
    if (req.method === 'OPTIONS') {
        res.header("Acess-Control-Allow-Method", "OPTIONS, HEAD, GET, POST, PATCH, DELETE")
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
