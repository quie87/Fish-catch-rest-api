const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const MemberSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  }
})

const collectionName = '_members'
const member = mongoose.model(collectionName, MemberSchema)

module.exports = member
