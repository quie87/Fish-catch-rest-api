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

const member = mongoose.model('members', MemberSchema)

module.exports = member
