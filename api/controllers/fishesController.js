const Fishes = require('../models/fishes')
const mongoose = require('mongoose')

exports.get_all_fishes = (req, res, next) => {
    Fishes.find()
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Works',
            fish: result
        })
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({
            message: 'There where no fishes registered yet'
        })
    })
}

exports.get_fish_by_id = (req, res, next) => {
    const id = req.params.fishId
    Fishes.findById(id)
    .exec()
    .then(doc => {
        console.log(doc)
        res.status(200).json(doc)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({})
    })
}

exports.create_new_fish_catch = (req, res, next) => {
    const fish = new Fishes ({
        _id: new mongoose.Types.ObjectId(),
        member: req.params.memberID,
        position: {
            longitude: req.body.longitude,
            latitude: req.body.latitude
        },
        specie: req.body.specie,
        weight: req.body.weight,
        length: req.body.length,
        // imgUrl: req.body.url Detta kommer inte fungera. Måste hantera form-data istället för json object
    })


    fish
    .save()
    // .exec()
    .then(result => {
        console.log(result)
    })
    .catch(err => console.log(err))
     
    res.status(201).json({
        message: 'Created a new fish catch',
        fishCreated: fish
    })
}

exports.edit_previus_fish_catch = (req, res, next) => {
    res.status(200).json({
        message: 'This will edit a fish record'
    })
}

exports.delete_previus_fish_catch = (req, res, next) => {
    res.status(200).json({
        message: 'This will delete a fish'
    })
}