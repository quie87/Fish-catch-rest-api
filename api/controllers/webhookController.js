const Hook = require('../models/hooks')
const baseurl = 'https://fish-catch-rest-api.herokuapp.com'

exports.GET_HOOKS = (req, res, next) => {
  res.status(200).json({
    message: '"Events" describes the types of events a member can subscribe to and "links" provide urls and information on how webhooks and subsciptions can be used',
    events: [
      {
        type: 'create',
        description: 'subscribe to event "create" to recive notice when a new catch is registred'
      }
    ],
    links: [
      {
        type: 'GET',
        url: `${baseurl}/webhooks/{memberid}`,
        description: 'Gets all hooks that a member are subscribed to',
        response: '[ { url, memberId, events } ]'
      },
      {
        type: 'POST',
        url: `${baseurl}/webhooks`,
        body: { url: 'String', memberid: 'String', events: 'String' },
        description: 'Subscribe a member to specified event with specified URL as callback',
        requires: 'Member must be logged in (authorized)'
      },
      {
        type: 'DELETE',
        url: `${baseurl}/webhooks`,
        body: { event: 'String', memberid: 'String' },
        description: 'Unsubscribe a user from event',
        requires: 'Member must be logged in (authorized)'
      }
    ]
  })
}

exports.GET_MEMBER_HOOKS = (req, res, next) => {
  const id = req.params.memberId

  Hook.find({ memberId: id })
    .then(doc => {
      const response = {
        subsciptions: doc.map(events => {
          return {
            _id: events._id,
            url: events.url,
            memberId: events.memberId,
            event: events.events,
            links: [
              {
                type: 'POST',
                url: `${baseurl}/hooks`,
                body: { events: 'event', memberId: 'memberId' },
                description: 'Deletes this webhook'
              }
            ]
          }
        })
      }
      res.status(200)
        .json({ response })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Failed to fetch subscriptions'
      })
    })
}

exports.SUBSCRIBE_TO_HOOK = (req, res, next) => {
  const { url, memberId, event } = req.body

  const newHook = new Hook({
    url,
    memberId,
    events: event
  })

  newHook.save()
    .then(result => {
      const subcribedHook = {
        _id: result._id,
        url: result.url,
        memberId: result.id,
        events: result.event,
        request: [
          {
            type: 'GET',
            url: `${baseurl}/webhoooks` + result.id,
            description: 'Get all subscriptions connected to this member'
          },
          {
            type: 'POST',
            url: `${baseurl}/webhooks`,
            body: { url: 'String', memberid: 'String', event: 'String' },
            description: 'Subscribe a member to specified event with specified URL as callback',
            requirement: 'Must be authenticated'
          },
          {
            type: 'DELETE',
            url: `${baseurl}/webhooks`,
            body: { event: 'String', memberid: 'String' },
            description: 'Unsubscribe a user from event',
            requirement: 'Must be authenticated'
          }
        ],
        Location: `${baseurl}/webhooks/` + result.id
      }
      res.status(201).json(subcribedHook)
    })
    .catch(() => res.status(500).json({ message: 'Could not save new webhook subscription' }))
}

exports.DELETE_HOOK = async (req, res, next) => {
  const { event, memberId } = req.body

  try {
    Hook.findOneAndDelete({ memberId, events: event })
      .then(res.status(202).json({
        message: 'Webhook was removed',
        request: [
          {
            type: 'POST',
            url: `${baseurl}/webhooks`,
            body: { url: 'String', memberid: 'String', event: 'String' },
            description: 'Subscribe a member to specified event with specified URL as callback',
            requirement: 'Must be authenticated'
          }
        ]
      }))
      .catch(() => res.status(404).json({ message: 'Could not delete given resource, make sure that correct data is posted.' }))
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete resource' })
  }
}
