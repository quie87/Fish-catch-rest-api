
const mongoose = require('mongoose')

// Create Schema
const FishesSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        member: {
            type: String,
            required: true
        },
        position: {
            longitude: {
                type: String,
                required: true
            },
            latitude: {
                type: String,
                required: true
            }
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

module.exports = mongoose.model('_fishes', FishesSchema)

