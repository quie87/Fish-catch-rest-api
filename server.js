'use strict'

const express = require('express')
const bodyParser = require('body-parser')
// const mongoose = require('./config/mongoose.js')
const logger = require('morgan')


const port = process.env.PORT || 3000

// instantiate a express object
const app = express()

// Middleware
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }))

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log('Press Ctrl-C to terminate...\n')
})

app.use('/', require('./api/routes/homeRouter'))
app.use('/members', require('./api/routes/membersRouter'))
app.use('/fishes', require('./api/routes/fishesRouter'))

// Errors
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Resource not found'
    })
})

app.use((err, req, res, next) => {
    if(err.message === '403') {
        res.status(403).json({
            message: '403'
        }) 
    } else {
        res.status(500).json({
            message: 'Internal server error'
        })
    }
})
