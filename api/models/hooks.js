const mongoose = require('mongoose')

// Create Schema
const HooksSchema = mongoose.Schema({
    memberId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    event: [
        {
            type: String,
            required: true
        }
    ],
})

module.exports = mongoose.model('hooks', HooksSchema)

