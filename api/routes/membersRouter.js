const router = require('express').Router()
const MemberController = require('../controllers/membersController')

router
    .get('/', MemberController.get_all_members)
    .post('/', MemberController.create_new_member)

module.exports = router