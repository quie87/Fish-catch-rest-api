const Fishes = require('../models/fishes')
const mongoose = require('mongoose')

const baseurl = 'http://localhost:3000'

exports.get_all_fishes = (req, res, next) => {
    Fishes.find()
    .select('member longitude latitude specie weight length createdAt')
    .then(result => {
        const response = {
            count: result.length,
            fish_catches: result.map(doc => {
                return {
                    _id: doc._id,
                    member: doc.member,
                    longitude: doc.longitude,
                    latitude: doc.latitude,
                    specie: doc.specie,
                    weight: doc.weight,
                    length: doc.length,
                    createdAt: doc.createdAt,
                    request: {
                        type: 'GET',
                        url: `${baseurl}/fishes/` + doc._id
                    }
                }
            })
        }

        res.status(200).json({
            response
        })
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
    .select('member longitude latitude specie weight length createdAt')
    .then(doc => {
        const fish_catch = {
            _id: doc._id,
            member: doc.member,
            longitude: doc.longitude,
            latitude: doc.latitude,
            specie: doc.specie,
            weight: doc.weight,
            length: doc.length,
            createdAt: doc.createdAt,
            request: {
                type: 'POST',
                url: `${baseurl}/fishes/` + doc._id,
                description: 'Deletes this entrie'
            }
        }

        res.status(200).json({
            fish_catch
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'Failed to fetch resource'
        })
    })
}

exports.create_new_fish_catch =  (req, res, next) => {
    // const member = Members.findById(req.params.memberID)

    const newFish = new Fishes ({
        // memberId: member._id,
        member: req.params.memberID, // change this to correct implementation when the concept of a member is working. Should be a field for member ID and member Name
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        specie: req.body.specie,
        weight: req.body.weight,
        length: req.body.length,
        // imgUrl: req.body.url Detta kommer inte fungera. Måste hantera form-data istället för json object
    })
    
    newFish.save()
    .then(newFishRecord => res.status(201).json(newFishRecord))
    .catch(() => res.status(500).json({ msg: 'Could not save new catch' }))
}

exports.edit_previus_fish_catch = (req, res, next) => {
    const id = req.params.fishID
    const updateOps = {}

    // Need to pass an array
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    Fishes.updateMany({ _id: id }, { $set: updateOps})
    .then(result => res.status(200).json({result}))         // get the fish to be able to return the updated version?
    .catch(err => res.status(500).json({ error: err }))
}

exports.delete_previus_fish_catch = (req, res, next) => {
    Fishes.findById(req.params.fishID)
    .then(fish => fish.remove())
    .then(fish => res.status(200).json({message: fish}))
    .catch(() => res.status(404).json({ msg: 'Could not delete todoItem from Data base' }))
}