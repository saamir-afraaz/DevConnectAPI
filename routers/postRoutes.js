const express = require('express')
const postController = require('../controllers/postController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/',postController.getPosts)
router.post('/',protect,postController.createPost)
router.patch('/:id',protect,postController.updatePost)
router.delete('/:id',protect,postController.deletePost)

module.exports = router