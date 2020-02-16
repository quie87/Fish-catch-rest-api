const Fishes = require('../models/fishes')

exports.get_all_fishes = (req, res, next) => {
    const query = Fishes.find({ name: 'lax'})
    query
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Works',
            fish: {
                name: result.name
            }
        })
    })
    .catch(err => {
        res.status(404).json({
            message: 'There where no fishes registered yet'
        })
    })

}

exports.create_new_fish_catch = (req, res, next) => {
    console.log(req.params.longitude)
    const fish = {
        memberID: req.params.memberID,
        position: {
            longitude: req.body.longitude,
            latitude: req.body.latitude
        },
        specie: req.body.specie,
        weight: req.body.weight,
        length: req.body.length,
        // imgUrl: req.body.url Detta kommer inte fungera. Måste hantera form-data istället för json object
    }

    // Fishes.save(fish)

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