const router = require('express').Router()
const FishesController = require('../controllers/fishesController')
const upload = require('../middleware/uploadImages')
const auth = require('../middleware/auth')

router
    .get('/', FishesController.get_all_fishes)
    .get('/:fishId', FishesController.get_fish_by_id)
    .post('/:memberID', auth, upload.single('fishImage'), FishesController.create_new_fish_catch)
    .patch('/:fishID', auth, FishesController.edit_previus_fish_catch)
    .delete('/:fishID', auth, FishesController.delete_fish_record)

module.exports = router