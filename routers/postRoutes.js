const express = require('express')
const postController = require('../controllers/postController')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/',postController.getPosts)
router.post('/',protect,postController.createPost)

module.exports = router