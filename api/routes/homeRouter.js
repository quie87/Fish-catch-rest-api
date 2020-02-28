const router = require('express').Router()
const controller = require('../controllers/homeController')

router.get('/', controller.GET_API_INDEX)

module.exports = router
