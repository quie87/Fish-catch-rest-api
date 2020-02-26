const router = require('express').Router()
const controller = require('../controllers/webhookController')

router.get('/', controller.GET_HOOKS)
router.get('/:userId', controller.GET_USER_HOOKS)
router.post('/', controller.SUBSCRIBE_TO_HOOK)
router.delete('/', controller.DELETE_HOOK)

module.exports = router