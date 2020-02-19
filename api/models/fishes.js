
const mongoose = require('mongoose')

// Create Schema
const FishesSchema = mongoose.Schema({
        member: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        },
        latitude: {
            type: String,
            required: true
        },
        specie: {
            type: String,
            required: true
        },
        weight: {
            type: String,
            required: true
        },
        length: {
            type: String,
            required: true
        },
        //   imgURL: {
        //       type: jpeg,
        //   },
        createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('fishes', FishesSchema)

