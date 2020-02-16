exports.GET_API_INDEX = (req, res, next) => {
    res.status(200).json({
        message: 'Welcome to our fish API, here follows some instructions on how to use it'
    })
}
