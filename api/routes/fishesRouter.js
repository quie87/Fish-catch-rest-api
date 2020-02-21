const router = require('express').Router()
const FishesController = require('../controllers/fishesController')

router
    .get('/', FishesController.get_all_fishes)
    .get('/:fishId', FishesController.get_fish_by_id)
    .post('/:memberID', FishesController.create_new_fish_catch)
    .patch('/:fishID', FishesController.edit_previus_fish_catch)
    .delete('/:fishID', FishesController.delete_fish_record)

module.exports = router