const Hook = require('../models/hooks')
const fetch = require('node-fetch')

exports.webhook = async (event, data) => {
  const body = {
    body: data
  }

  const hooks = await Hook.find({ events: event })

  hooks.forEach(hook => {
    fetch(`${hook.url}`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
      .catch(err => console.log(err))
  })
}
