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
    await redisClient.del('all_posts'); 
    res.status(201).json(newPost)
})

exports.getPosts = asyncHandler(async (req, res) => {
    const cachedPosts = await redisClient.get('all_posts');

    if (cachedPosts) {
        console.log("Serving from Cache!");
        return res.json(JSON.parse(cachedPosts)); 
    }

    console.log("Serving from MongoDB");
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'name username');


    await redisClient.setEx('all_posts', 3600, JSON.stringify(posts));

    res.json(posts);
});

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
    await redisClient.del('all_posts'); 
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
    await redisClient.del('all_posts'); 
    res.json({ id: req.params.id, message: "Post deleted" })
})

exports.toggleLike = asyncHandler(async (req,res) => {
    const post = Post.findById(req.params.id)
    const userId = req.user.id

    if(!post){
        res.status(404);
        throw new Error("Post not Found");
    }

    const isLiked = post.likes.includes(userId)
    
    if(isLiked){
        post.likes = post.likes.filter(user => user.id !== userId)
    } else {
        post.likes.push(userId)
    }
    await post.save()
    res.json(post);
})