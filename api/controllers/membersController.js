const mongoose = require('mongoose')
const Member = require('../models/member')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

// @route POST api/members
// @description Register new member
// Public
exports.create_new_member = (req, res) => {
  const { name, email, password } = req.body

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Pls enter all fields' })
  }

  if (password.length < 9) {
    return res.status(400).json({ message: 'Password to weak: Enter a password 8 digits long and include at least one numeric digit.' })
  }

  // Check for existing member
  Member.findOne({ email })
    .then(member => {
      if (member) return res.status(409).json({ message: 'Member already exists' })

      let newMember = new Member({
        name,
        email,
        password
      })

      // Create salt & hash
      bcrypt.genSalt(12, (err, salt) => {
        if (err) {
            return res.status(500).json({ error: err })
        }

        bcrypt.hash(newMember.password, salt, (err, hash) => {
          if (err) {
              return res.status(500).json({ error: err })
          }

          newMember.password = hash
          newMember.save()
            .then(member => {
              jwt.sign(
                { id: member.id },
                process.env.jwtSecret,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) {
                        return res.status(500).json({ error: err })
                    }
                  res.status(201).json({
                    token,
                    member: {
                      _id: member._id,
                      name: member.name,
                      email: member.email,
                      register_date: member.register_date
                    },
                    message: 'Created new member'
                  }).catch((err) => res.status(500).json({ message: err }))
                }
              )
            })
        })
      })
    })
}

exports.get_all_members = (req, res) => {
    Member.find()
      .then(result => {
        const response = {
          count: result.length,
          members: result.map(member => {
              return {
              name: member.name,
            }
          })
        }
        res.status(200).json(response)
      }).catch(err => res.status(500).json({ message: err }))
  }

exports.get_member = (req, res) => {
    Member.findById(req.user.id)
      .select('-password')
      .then(response => {
        const member = {
          _id: response._id,
          name: response.name,
          email: response.email,
          register_date: response.register_date
        }
        res.status(200).json(member)
      }).catch(err => res.status(500).json({ message: err }))
  }

  exports.login_member = (req, res) => {
    const { email, password } = req.body
  
    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Pls enter all fields' })
    }
  
    // Check for existing member
    Member.findOne({ email })
      .then(member => {
        if (!member) return res.status(400).json({ message: 'Wrong email or password' })
  
        // Validate password
        bcrypt.compare(password, member.password)
          .then(isMatch => {
            if (!isMatch) return res.status(400).json({ message: 'Wrong email or password' })
  
            jwt.sign(
              { id: member.id },
              process.env.jwtSecret,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) {
                  return res.status(500).json({ error: err })
                }
                res.status(200).json({
                  token,
                  member: {
                    _id: member._id,
                    name: member.name,
                    email: member.email,
                    register_date: member.register_date
                  }
                })
              }
            )
          })
      })
  }
