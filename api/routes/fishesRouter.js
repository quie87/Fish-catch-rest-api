const router = require('express').Router()
const FishesController = require('../controllers/fishesController')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false) // perhaps add some error handeling to let the user know that the image they try to upload is not valid
    }
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router
    .get('/', FishesController.get_all_fishes)
    .get('/:fishId', FishesController.get_fish_by_id)
    .post('/:memberID', upload.single('fishImage'), FishesController.create_new_fish_catch)
    .patch('/:fishID', FishesController.edit_previus_fish_catch)
    .delete('/:fishID', FishesController.delete_fish_record)

module.exports = router