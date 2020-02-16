exports.get_all_fishes = (req, res, next) => {
    res.status(200).json({
        message: 'This will return all fishes'
    })
}

exports.create_new_fish_catch = (req, res, next) => {
    console.log(req.body.name)
    res.status(200).json({
        message: 'This will create a new fish catch'
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