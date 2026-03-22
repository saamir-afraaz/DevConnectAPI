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

exports.updatePost = asyncHandler(async (req,res) => {
    const post = await Post.findById(req.params.id)

    if(!post) {
        res.status(404)
        throw new Error("404 Not Found")
    }
    if(post.author.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedPost)
})

exports.deletePost = asyncHandler(async (req,res) => {
    const post = await Post.findById(req.params.id)

    if(!post) {
        res.status(404)
        throw new Error("404 Not Found")
    }
    if(post.author.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }
    const deletedPost = await Post.findByIdAndDelete(req.params.id)
    res.json({ id: req.params.id, message: "Post deleted" })
})