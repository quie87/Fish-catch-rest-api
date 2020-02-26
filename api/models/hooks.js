const mongoose = require('mongoose')

// Create Schema
const HooksSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    memberId: {
        type: String,
        required: true
    },
    events: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('hooks', HooksSchema)

