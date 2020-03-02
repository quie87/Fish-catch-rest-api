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
      if (member) return res.status(409).json({ message: 'Failed to create new member' })

      const newMember = new Member({
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
                { id: member._id },
                process.env.jwtSecret,
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) {
                    return res.status(500).json({ error: err })
                  }

                  const response = {
                    token,
                    member: {
                      _id: member._id,
                      name: member.name,
                      email: member.email,
                      register_date: member.register_date
                    },
                    links: [
                      {
                        title: 'Login',
                        href: `${baseurl}/members/login`,
                        method: 'POST',
                        description: 'Sign in member',
                        schema: {
                          email: 'String',
                          password: 'String'
                        },
                        response: {
                          token: 'A JTW Token',
                          member: 'An object with the member data, id, name, email and register date'
                        }
                      }
                    ]
                  }
                  res.status(201).json(response).catch((err) => res.status(500).json({ message: err }))
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
            name: member.name
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
    .then(data => {
      const response = {
        _id: data._id,
        name: data.name,
        email: data.email,
        register_date: data.register_date,
        links: [
          {
            self: `${baseurl}/members/`
          },
          {
            title: 'Delete member',
            href: `${baseurl}/members/` + data._id,
            method: 'DELETE',
            description: 'Delete this member. Can only be done by the account owner',
            require: 'Auth'
          }
        ]
      }
      res.status(200).json(response)
    }).catch(() => res.status(500)
      .json({ message: `Failed to find a member with the ID of ${id}` }))
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

              const response = {
                token,
                member: {
                  _id: member._id,
                  name: member.name,
                  email: member.email,
                  register_date: member.register_date
                },
                links: [
                  {
                    title: 'Get catches',
                    href: `${baseurl}/fishes`,
                    method: 'GET',
                    description: 'Get all catch records'
                  },
                  {
                    title: 'Create catch',
                    href: `${baseurl}/fishes`,
                    method: 'POST',
                    description: 'Create new catch',
                    schema: {
                      longitude: 'String',
                      latitude: 'String',
                      specie: 'String',
                      weight: 'String',
                      length: 'String',
                      imageUrl: 'String'
                    }
                  },
                  {
                    title: 'Update catch',
                    href: `${baseurl}/fishes/{fishId}`,
                    method: 'PATCH',
                    description: 'Update catch record. Fields that can be set with "propName" are; longitude, latitude, specie, weight, length, fishImage. All as Strings.' +
                      'To clearify. You need to send an array with objects made of key/value pairs as shown in "schema"',
                    schema: [
                      { propName: 'Field you want to change', value: 'The new value' }
                    ]
                  },
                  {
                    title: 'Delete Catch',
                    href: `${baseurl}/fishes/{fishId}`,
                    method: 'DELETE'
                  },
                  {
                    title: 'Webhook events',
                    href: `${baseurl}/webhooks`,
                    method: 'GET',
                    description: 'Retrives the possible events that a member can subscribe to'
                  },
                  {
                    title: 'Get member specific hooks',
                    href: `${baseurl}/webhooks/{memberid}`,
                    method: 'GET',
                    description: 'Gets all hooks that a member are subscribed to',
                    response: '[ { url, memberId, events } ]'
                  },
                  {
                    title: 'Subscribe to event',
                    href: `${baseurl}/webhooks`,
                    method: 'POST',
                    schema: {
                      url: 'String',
                      memberid: 'String',
                      events: 'String'
                    },
                    description: 'Subscribe a member to specified event with specified URL as callback'
                  },
                  {
                    title: 'Unsubscribe to event',
                    href: `${baseurl}/webhooks`,
                    method: 'DELETE',
                    schema: {
                      event: 'String',
                      memberid: 'String'
                    },
                    description: 'Unsubscribe a user from event'
                  }
                ]
              }
              res.status(200).json(response)
            }
          )
        })
    })
}

exports.delete_member = async (req, res, next) => {
  const id = req.params.memberId
  const memberId = req.user.id

  if (memberId !== id) {
    return res.status(401).json({ message: 'You are not authorized to delete this member' })
  }

  try {
    await Member.deleteOne({ _id: id })
  } catch (error) {
    res.status(404).json({
      message: `Could not delete member with the ID: ${id}`,
      links: [
        {
          title: 'Delete member',
          type: 'POST',
          url: `${baseurl}/members/` + '{member_Id}',
          description: 'Delete a member by ID'
        }
      ]
    })
  }

  const response = {
    message: 'Member deleted',
    links: [
      {
        title: 'See all members',
        href: `${baseurl}/members`,
        method: 'GET',
        description: 'Get all members'
      },
      {
        title: 'Register',
        href: `${baseurl}/members/signup`,
        method: 'POST',
        description: 'Creates a new member',
        schema: [
          { name: 'String', desc: 'Enter your full name', minLength: '1 character' },
          { email: 'String', desc: 'Enter valid email adress' },
          { password: 'String', desc: 'Enter a strong password', minLength: '8 characters' }
        ],
        response: {
          token: 'A JTW Token',
          member: 'An object that describes the newly created member',
          message: 'Describes if registration was successfull or not'
        }
      },
      {
        title: 'Login',
        href: `${baseurl}/members/login`,
        method: 'POST',
        schema: {
          email: 'String',
          password: 'String'
        },
        description: 'Create new member'
      }
    ]
  }

  res.status(202).json(response)
}
