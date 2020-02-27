const Member = require('../models/member')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const baseurl = 'https://fish-catch-rest-api.herokuapp.com'

require('dotenv').config()

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
      if (member) return res.status(409).json({ message: 'Member already exists' }) // Should make up a better response message

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
  const id = req.user.id

  Member.findById(id)
    .select('-password')
    .then(response => {
      const member = {
        _id: response._id,
        name: response.name,
        email: response.email,
        register_date: response.register_date
      }
      res.status(200).json(member)
    }).catch(err => 
      res.status(500)
      .json({ 
        message: `Member with ID of ${id} does not exist` 
      }))
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
      if (!member) return res.status(401).json({ message: 'Wrong email or password' })

      // Validate password
      bcrypt.compare(password, member.password)
      .then(isMatch => {
        if (!isMatch) return res.status(401).json({ message: 'Wrong email or password' })

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

exports.delete_member = (req, res, next) => {
  const id = req.params.memberId

  Member.findById(id)
  .then(member => member.remove())
  .then(response => res.status(204).json({
      message: 'Member deleted',
      request: [
        {
          type: 'GET',
          url: `${baseurl}/members/`,
          description: 'Get all members'
        },
        {
          type: 'POST',
          url: `${baseurl}/members/signup`,
          body: { name: 'String', email: 'String', password: 'String'},
          description: 'Create new member'
        },
        {
          type: 'POST',
          url: `${baseurl}/members/login`,
          body: { email: 'String', password: 'string' },
          description: 'Create new member'
        }
      ]
  }))
  .catch(() => res.status(404).json({ message: `Could not delete member with the ID: ${ id }` }))
}