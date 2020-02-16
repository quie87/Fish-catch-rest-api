exports.get_all_members = (req, res, next) => {
    res.status(200).json({
        message: 'This will return all users'
    })
}

exports.create_new_member = (req, res, next) => {
    console.log(req.body.name)
    res.status(200).json({
        message: 'This will create a new member'
    })
}