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
        self: `${baseurl}/webhooks`,
        method: 'GET'
      }
    ]
  })
}

exports.GET_MEMBER_HOOKS = (req, res, next) => {
  const id = req.params.memberId

  Hook.find({ memberId: id })
    .then(doc => {
      const response = {
        count: doc.length,
        links: [
          {
            self: `${baseurl}/webhooks/{memberId}`,
            method: 'GET'
          },
          {
            title: 'Delete hook',
            href: `${baseurl}/webhooks/{hookId}`,
            method: 'POST',
            schema: {
              events: 'event',
              memberId: 'memberId'
            },
            description: 'Deletes specified webhook'
          }
        ],
        subsciptions: doc.map(events => {
          return {
            _id: events._id,
            url: events.url,
            memberId: events.memberId,
            event: events.events
          }
        })
      }
      res.status(200)
        .json(response)
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
        links: [
          {
            self: `${baseurl}/webhooks`,
            method: 'POST'
          },
          {
            title: 'DELETE',
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
        links: [
          {
            self: `${baseurl}/webhooks`,
            method: 'DELETE'
          }
        ]
      }))
      .catch(() => res.status(404).json({ message: 'Could not delete given resource, make sure that correct data is posted.' }))
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete resource' })
  }
}
