
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const FishesSchema = new Schema({
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


const collectionName = '_fishes'
const fishes = mongoose.model(collectionName, FishesSchema)

module.exports = fishes