const baseurl = process.env.baseurl

exports.GET_API_INDEX = (req, res, next) => {
    console.log(req.url)
    res.status(200).json({
        message: 'Welcome to our fish API, here follows some instructions on how to use it',
        links: [
            {
                type: 'GET',
                url: `${baseurl}/fishes`,
                description: 'Gets all fish records'
            },
            {
                type: 'POST',
                url: `${baseurl}/members/signup`,
                request: { name: 'string', email: 'string', password: 'string' },
                description: 'Creates a new member',
                response: 'JWT Token, should be saved in "x-auth-token" header. Also return newly created member object'
            },
            {
                type: 'POST',
                url: `${baseurl}/members/login`,
                request: { email: 'string', password: 'string' },
                description: 'Sign in member',
                respons: 'JWT Token, should be saved in "x-auth-token" header'
            },
            {
                type: 'GET',
                url: `${baseurl}/webhooks`,
                respons: 'Gives back information about how to set webhooks'
            }
        ]
    })
}
