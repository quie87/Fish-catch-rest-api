const Fishes = require('../models/fishes')
const { webhook } = require('../lib/broadcastHooks')
const baseurl = 'https://fish-catch-rest-api.herokuapp.com'

exports.get_all_fishes = (req, res, next) => {
    Fishes.find()
    .select('memberId longitude latitude specie weight length fishImage')
    .then(result => {
        const response = {
            count: result.length,
            fish_catches: result.map(doc => {
                return {
                    _id: doc._id,
                    member: doc.memberId,
                    longitude: doc.longitude,
                    latitude: doc.latitude,
                    specie: doc.specie,
                    weight: doc.weight,
                    length: doc.length,
                    fishImage: doc.fishImage,
                    request: [
                        {
                        type: 'GET',
                        url: `${baseurl}/fishes/` + doc._id,
                        description: 'Get this fish record only'
                    },
                    {
                        type: 'POST',
                        url: `${baseurl}/fishes/`,
                        body: { member: 'String', longitude: 'String', latitude: 'String', specie: 'String', weight: 'String', length: 'String', fishImage: 'String'},
                        description: 'Create new record'
                    },
                    {
                        type: 'PATCH',
                        url: `${baseurl}/fishes/` + result._id,
                        body: [
                            {"propName": "Field you want to change", "value": "The new value"}
                        ],
                        description: 'Update fish record. Fields that can be set with "propName" are; member, longitude, latitude, specie, weight, length, fishImage. All as Strings.' + 
                        'To clearify. You need to send an array with objects made of key/value pairs as shown in "body"',
                        jwt_token: 'Must be authenticated'
                    },
                    {
                        type: 'DELETE',
                        url: `${baseurl}/fishes/` + doc._id,
                        jwt_token: 'Must be authenticated'
                    }
                ]
            }
        })
    }
    res.status(200)
        .json({response})
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
        const fish_catch = {
            _id: doc._id,
            member: doc.memberId,
            longitude: doc.longitude,
            latitude: doc.latitude,
            specie: doc.specie,
            weight: doc.weight,
            length: doc.length,
            fishImage: doc.fishImage,
            createdAt: doc.createdAt,
            request: [
                {
                    type: 'POST',
                    url: `${baseurl}/fishes/`,
                    body: { member: 'String', longitude: 'String', latitude: 'String', specie: 'String', weight: 'String', length: 'String', fishImage: 'String'},
                    description: 'Create new record'
                },
                {
                    type: 'PATCH',
                    url: `${baseurl}/fishes/` + doc._id,
                    body: [
                        {propName: "Field you want to change", value: "The new value"}
                    ],
                    description: 'Update fish record. Fields that can be set with "propName" are; member, longitude, latitude, specie, weight, length, fishImage. All as Strings.' + 
                    'To clearify. You need to send an array with objects made of key/value pairs as shown in "body"',
                    jwt_token: 'Must be authenticated'
                },
                {
                    type: 'DELETE',
                    url: `${baseurl}/fishes/` + doc._id,
                    jwt_token: 'Must be authenticated'
                }
            ]
        }
        res.status(200).json({ fish_catch })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'Failed to fetch resource'
        })
    })
}

exports.create_new_fish_catch = async (req, res, next) => {
    const newFish = new Fishes ({
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
                memberId: result.id,
                species: result.specie,
                request: [
                    {
                        type: 'GET',
                        url: `${baseurl}/fishes/` + result._id,
                        description: 'Get the new fish record'
                    },
                    {
                        type: 'GET',
                        url: `${baseurl}/fishes/`,
                        description: 'Get all fish records'
                    },
                    {
                        type: 'PATCH',
                        url: `${baseurl}/fishes/` + result._id,
                        body: [
                            {"propName": "Field you want to change", "value": "The new value"}
                        ],
                        description: 'Update fish record. Fields that can be set with "propName" are; member, longitude, latitude, specie, weight, length, fishImage. All as Strings.' + 
                        'To clearify. You need to send an array with objects made of key/value pairs as shown in "body"',
                        jwt_token: 'Must be authenticated'
                    },
                    {
                        type: 'DELETE',
                        url: `${baseurl}/fishes/` + result._id,
                        jwt_token: 'Must be authenticated'
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
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    Fishes.updateMany({ _id: id }, { $set: updateOps})
    .then(result => {
        res.status(200).json({
            result: result,
            message: 'Record updated',
            request: [
                {
                    type: 'GET',
                    url: `${baseurl}/fishes/` + id,
                    description: 'Get updated record'
                },
                {
                    type: 'GET',
                    url: `${baseurl}/fishes/`,
                    description: 'Get all fish records'
                },                
                {
                    type: 'POST',
                    url: `${baseurl}/fishes/`,
                    body: { member: 'String', longitude: 'String', latitude: 'String', specie: 'String', weight: 'String', length: 'String', fishImage: 'String'},
                    description: 'Create new record'
                },
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
            request: [
                {
                    type: 'GET',
                    url: `${baseurl}/fishes/`,
                    description: 'Get all fishes'
                },
                {
                    type: 'POST',
                    url: `${baseurl}/fishes/`,
                    body: { member: 'String', longitude: 'String', latitude: 'String', specie: 'String', weight: 'String', length: 'String'},
                    description: 'Create new record'
                }
            ]
        }))
        .catch(() => res.status(404).json({ messsage: `Could not delete fish record with ID ${id}` }))
    } catch (err) {
        res.status(500).json({ messsage: `Failed to delete fish record` })
    }
}