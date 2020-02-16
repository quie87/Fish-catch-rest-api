const router = require('express').Router()
const FishesController = require('../controllers/fishesController')

router
    .get('/', FishesController.get_all_fishes)
    .post('/:userID', FishesController.create_new_fish_catch)
    .put('/:fishID', FishesController.edit_previus_fish_catch)
    .delete('/:fishID', FishesController.delete_previus_fish_catch)

module.exports = router