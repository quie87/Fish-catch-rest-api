const baseurl = 'https://fish-catch-rest-api.herokuapp.com'

exports.GET_API_INDEX = (req, res, next) => {
    res.status(200).json({
        message: 'Welcome to our fish API, here follows some links to help you navigate',
        links: [
            {
                type: 'GET',
                url: `${baseurl}/fishes`,
                description: 'Get all catch records'
            },
            {
                type: 'POST',
                url: `${baseurl}/members/signup`,
                body: { name: 'String', email: 'String', password: 'String' },
                description: 'Creates a new member',
                response: {
                    token: 'A JTW Token',
                    member: 'An object that describes the newly created member',
                    message: 'Describes if registration was successfull or not'
                },
            },
            {
                type: 'POST',
                url: `${baseurl}/members/login`,
                body: { email: 'String', password: 'String' },
                description: 'Sign in member',
                response: {
                    token: 'A JTW Token',
                    member: 'An object that describes the newly created member',
                    message: 'Describes if registration was successfull or not'
                },
            },
            {
                type: 'GET',
                url: `${baseurl}/webhooks`,
                respons: {
                    message: 'How to subscribe to hooks',
                    events: 'Type of hook events',
                    links: 'Set of links with information on how to proceed'
                }
            }
        ]
    })
}
