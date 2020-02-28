const router = require('express').Router()
const controller = require('../controllers/webhookController')
const auth = require('../middleware/auth')

router.get('/', controller.GET_HOOKS)
router.get('/:memberId', auth, controller.GET_MEMBER_HOOKS)
router.post('/', auth, controller.SUBSCRIBE_TO_HOOK)
router.delete('/', auth, controller.DELETE_HOOK)

module.exports = router