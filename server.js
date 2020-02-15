'use strict'

const express = require('express')
require('dotenv').config()

const port = process.env.PORT || 3000

// instantiate a express object
const app = express()


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log('Press Ctrl-C to terminate...\n')
})

app.get('/', (req, res, next) => {
    res.send('hello world!')
})

