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

// create a mongoose model to export
const member = mongoose.model('member', MemberSchema)

module.exports = member
