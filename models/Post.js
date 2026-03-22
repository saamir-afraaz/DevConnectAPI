const mongoose  = require('mongoose')

const PostSchema = new mongoose.Schema({
    title : {
        type: String,
        required : [true,"Enter a Title"]
    },
    content : {
        type: String,
        required : [true,"Enter some Content"]
    },
    tags : {
        type: [String],
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : [true,"Enter a User"]
    }
},{
    timestamps : true
})

module.exports = mongoose.model('Post',PostSchema)