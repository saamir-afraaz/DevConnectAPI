const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')

exports.createPost = asyncHandler(async (req,res) => {
    const {title,content,tags} = req.body
    const newPost = await Post.create({
        title : title,
        content : content,
        tags : tags,
        author : req.user.id
    })
    res.status(201).json(newPost)
})

exports.getPosts = asyncHandler(async (req,res) => {
    const posts = await Post.find().sort({createdAt : -1}).populate('author','name username')
    res.json(posts)
})