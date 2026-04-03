const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: '30d'});
}

exports.registerUser = asyncHandler(async (req,res) => {
    const {name,username,email,password} = req.body;

    const user1 = await User.findOne({username});
    const user2 = await User.findOne({email})

    if(user1 || user2) {
        res.status(400);
        throw new Error("Username or email already exists")
    }

    const newUser = await User.create({
        name,
        username,
        email,
        password
    })
    res.status(201).json({
        _id : newUser.id,
        name : newUser.name,
        username : newUser.username,
        email : newUser.email,
        token : generateToken(newUser._id) //this logs the user in after registering
        
    })
})

exports.loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(user && await bcryptjs.compare(password,user.password)){
        res.json({
            _id : user.id,
            email : user.email,
            username : user.username,
            token : generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid email or pass")
    }
})