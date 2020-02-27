const router = require('express').Router()
const controller = require('../controllers/webhookController')

router.get('/', controller.GET_HOOKS)
router.get('/:memberId', controller.GET_MEMBER_HOOKS)
router.post('/', controller.SUBSCRIBE_TO_HOOK)
router.delete('/', controller.DELETE_HOOK)

module.exports = router