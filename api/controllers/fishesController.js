const Fishes = require('../models/fishes')
const { webhook } = require('../lib/broadcastHooks')
const baseurl = 'https://fish-catch-rest-api.herokuapp.com'

exports.get_all_fishes = (req, res, next) => {
  Fishes.find()
    .select('longitude latitude specie weight length fishImage')
    .then(result => {
      const response = {
        count: result.length,
        links: [
          {
            self: `${baseurl}/fishes`,
            method: 'GET'
          },
          {
            title: 'Get specific catch record',
            href: `${baseurl}/fishes/{fishId}`,
            method: 'GET',
            description: 'Get a specific catch record by its ID'
          }
        ],
        fish_catches: result.map(doc => {
          return {
            _id: doc._id,
            longitude: doc.longitude,
            latitude: doc.latitude,
            specie: doc.specie,
            weight: doc.weight,
            length: doc.length,
            fishImage: doc.fishImage
          }
        })
      }
      res.status(200)
        .json({ response })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Failed to fetch resources'
      })
    })
}

exports.get_fish_by_id = (req, res, next) => {
  const id = req.params.fishId

  Fishes.findById(id)
    .then(doc => {
      const fishCatch = {
        _id: doc._id,
        memberId: doc.memberId,
        longitude: doc.longitude,
        latitude: doc.latitude,
        specie: doc.specie,
        weight: doc.weight,
        length: doc.length,
        fishImage: doc.fishImage,
        createdAt: doc.createdAt,
        links: [
          {
            self: `${baseurl}/fishes/` + doc._id,
            method: 'GET'
          },
          {
            title: 'Update catch',
            href: `${baseurl}/fishes/` + doc._id,
            method: 'PATCH',
            body: [
              { propName: 'Field you want to change', value: 'The new value' }
            ],
            description: 'Update catch record. Fields that can be set with "propName" are; longitude, latitude, specie, weight, length, fishImage. All as Strings.' +
            'To clearify. You need to send an array with objects made of key/value pairs as shown in "body"'
          },
          {
            title: 'Delete catch',
            href: `${baseurl}/fishes/` + doc._id,
            method: 'DELETE'
          }
        ]
      }
      res.status(200).json({ fishCatch })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Failed to fetch resource'
      })
    })
}

exports.create_new_fish_catch = async (req, res, next) => {
  const newFish = new Fishes({
    memberId: req.user.id,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    specie: req.body.specie,
    weight: req.body.weight,
    length: req.body.length,
    fishImage: req.body.fishImage
  })

  newFish.save()
    .then(result => {
      const createdFishCatch = {
        _id: result._id,
        member: result.name,
        species: result.specie,
        links: [
          {
            self: `${baseurl}/fishes` + result._id,
            method: 'POST'
          },
          {
            title: 'Get specific catch record',
            href: `${baseurl}/fishes/` + result._id,
            method: 'GET',
            description: 'Get the newly created record'
          },
          {
            type: 'PATCH',
            url: `${baseurl}/fishes/` + result._id,
            body: [
              { propName: 'Field you want to change', value: 'The new value' }
            ],
            description: 'Update catch record. Fields that can be set with "propName" are; longitude, latitude, specie, weight, length, fishImage. All as Strings.' +
            'To clearify. You need to send an array with objects made of key/value pairs as shown in "body"'
          },
          {
            type: 'DELETE',
            url: `${baseurl}/fishes/` + result._id
          }
        ]
      }

      const newFish = `${baseurl}/fishes/` + result._id

      webhook('create', newFish)
      res.status(201).json(createdFishCatch)
    })
    .catch((e) => res.status(500).json({ message: 'Could not save new catch' + e }))
}

exports.edit_previus_fish_catch = (req, res, next) => {
  const id = req.params.fishID

  const updateOps = {}

  // Need to pass an array
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }

  Fishes.updateMany({ _id: id }, { $set: updateOps })
    .then(result => {
      res.status(200).json({
        message: 'Record updated',
        links: [
          {
            self: `${baseurl}/fishes/`,
            method: 'Patch'
          }
        ]
      })
    }).catch(err => res.status(500).json({ error: err }))
}

exports.delete_fish_record = (req, res, next) => {
  const id = req.params.fishID

  try {
    Fishes.findById(id)
      .then(fish => fish.remove())
      .then(res.status(202).json({
        message: 'Record deleted',
        links: [
          {
            self: `${baseurl}/fishes/`,
            method: 'DELETE'
          }
        ]
      }))
      .catch(() => res.status(404).json({ messsage: `Could not delete fish record with ID ${id}` }))
  } catch (err) {
    res.status(500).json({ messsage: 'Failed to delete fish record' })
  }
}
