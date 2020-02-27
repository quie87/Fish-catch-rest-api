const Hook = require('../models/hooks')
const Member = require('../models/member')
const mongoose = require('mongoose')
const baseurl = 'https://fish-catch-rest-api.herokuapp.com'

exports.GET_HOOKS = (req, res, next) => {
    res.status(200).json({
        message: 'Here you can subscribe to hooks',
        events: [
            {
                type: 'create',
                description: 'subscribe to event "create" to recive notice when a new catch is registred'
            }
        ],
        links: [
            {
                type: 'GET',
                url: `${baseurl}/webhooks/{userid}`,
                description: 'Gets all hooks that a user are subscribed to',
                response: '[ { url, userid, event } ]',
            },
            {
                type: 'POST',
                url: `${baseurl}/webhooks/`,
                body: { userid: 'String', url: 'String', event: 'String' },
                description: 'Subscribe a user to specified event with specified URL as callback',
                requires: 'User must be logged in (authorized)'
            },
            {
                type: 'DELETE',
                url: `${baseurl}/webhooks`,
                body: '{ event: String, userid: String}',
                description: 'Delete specified webhook from user',
                requires: 'User must be logged in (authorized)'
            }
        ]
    })
}

exports.GET_USER_HOOKS = (req, res, next) => {
    const id = req.params.userId

    Hook.find({ memberId: id })
    .then(doc => {
        const response = {
            subsciptions: doc.map(events => {
                return {
                    _id: events._id,
                    url: events.url,
                    memberId: events.memberId,
                    event: events.event
                }
            }),
            request: [
                {
                    type: 'POST',
                    url: `${baseurl}/hooks/{_id}`,
                    description: 'Deletes this webhook'
                },
            ]
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
    console.log(url)

    const newHook = new Hook ({
        url,
        memberId,
        events: event,
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
                        url: `${baseurl}/webhoooks/` + result._id,
                        description: 'Get the new webhook documentation'
                    },
                    {
                        type: 'POST',
                        url: `${baseurl}/webhooks/`,
                        body: { userid: 'String', url: 'String', event: 'String' },
                        description: 'Subscribe a user to specified event with specified URL as callback',
                        requires: 'User must be logged in (authorized)'
                    },
                    {
                        type: 'DELETE',
                        url: `${baseurl}/webhooks`,
                        body: '{ event: String, userid: String}',
                        description: 'Delete specified webhook from user',
                        requires: 'User must be logged in (authorized)'
                    }
                ]
            }
        res.status(201).json(subcribedHook)
    })    
    .catch(() => res.status(500).json({ message: 'Could not save new webhook subscription' }))
}

exports.DELETE_HOOK = async (req, res, next) => {
    const { event, memberId } = req.body

    Hook.findOneAndDelete({ memberId, events: event })
    .then(res.status(202).json({
        message: 'Webhook was removed',
        request: [
            {
                type: 'POST',
                url: `${baseurl}/webhooks/`,
                body: { userid: 'String', url: 'String', event: 'String' },
                description: 'Subscribe a user to specified event with specified URL as callback',
                requires: 'User must be logged in (authorized)'
            },
        ]
    }))
    .catch((e) => res.status(500).json({message: 'did not work' + e}))
}