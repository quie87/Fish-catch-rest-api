const baseurl = 'https://fish-catch-rest-api.herokuapp.com'

exports.GET_API_INDEX = (req, res, next) => {
  res.status(200).json({
    message: 'Welcome to our fish API, here follows some links to help you navigate',
    links: [
      {
        self: `${baseurl}`,
        method: 'GET',
        description: 'Starting point of the API'

      },
      {
        title: 'Get catches',
        href: `${baseurl}/fishes`,
        method: 'GET',
        description: 'Get all catch records'
      },
      {
        title: 'Get one catch',
        href: `${baseurl}/fishes/fishid`,
        method: 'GET',
        description: 'Get specific catch record'
      },
      {
        title: 'Register',
        href: `${baseurl}/members/signup`,
        method: 'POST',
        description: 'Creates a new member',
        schema: [
          { name: 'String', desc: 'Enter your full name', minLength: '1 character' },
          { email: 'String', desc: 'Enter valid email adress' },
          { password: 'String', desc: 'Enter a strong password', minLength: '8 characters' }
        ],
        response: {
          token: 'A JTW Token',
          member: 'An object that describes the newly created member',
          message: 'Describes if registration was successfull or not'
        }
      },
      {
        title: 'Login',
        href: `${baseurl}/members/login`,
        method: 'POST',
        description: 'Sign in member',
        schema: {
          email: 'String',
          password: 'String'
        },
        response: {
          token: 'A JTW Token',
          member: 'An object with the member data, id, name, email and register date'
        }
      }
    ]
  })
}
