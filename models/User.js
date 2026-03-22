const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')


const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,"Enter Your Name"]
    },
    username : {
        type : String,
        required : [true,"Enter Your Name"],
        unique : true
    },
    email : {
        type : String,
        required : [true,"Enter Your Email"],
        unique : true
    },
    password : {
        type : String,
        required : [true,"Enter Your Password"]
    }
},{
    timestamps: true
})

UserSchema.pre('save',async function () {
    if(!this.isModified('password')) return ;

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password,salt);
})

module.exports = mongoose.model('User',UserSchema)