const router = require('express').Router()
const MemberController = require('../controllers/membersController')
const auth = require('../middleware/auth')

router
    // .get('/', MemberController.get_all_members)
    .post('/', auth, MemberController.get_member)
    .post('/signup', MemberController.create_new_member)
    .post('/login', MemberController.login_member)

module.exports = router