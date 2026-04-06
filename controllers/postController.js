const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')
const redisClient = require('../config/redis')

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
    try {
        const cachedPosts = await redisClient.get('all_posts');
        if (cachedPosts) {
            return res.json(JSON.parse(cachedPosts)); 
        }
    } catch (err) {
        console.error("Redis Cache Error:", err);
    }

    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'name username');
    
    try {
        await redisClient.setEx('all_posts', 3600, JSON.stringify(posts));
    } catch (err) {
        console.error("Redis Set Error:", err);
    }

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
    const post = await Post.findById(req.params.id); 
    const userId = req.user.id;

    if(!post){
        res.status(404);
        throw new Error("Post not Found");
    }
    let message = "";

    const isLiked = post.likes.some(id => id.toString() === userId.toString());
    
    if(isLiked){
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        message = "Post unliked"
    } else {
        post.likes.push(userId);
        message = "Post liked"
    }

    await post.save();
    await redisClient.del('all_posts'); 
    res.json({message: message});
});