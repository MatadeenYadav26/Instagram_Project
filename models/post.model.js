const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imgUrl:{
        type:String,
        required:[true , "Image URL is required to cfreate a post"]
    },
    user:{
        ref:'users',
        type:mongoose.Schema.Types.ObjectId,
        required:[true , "User id is required to create a post"]
    }
})

const postModel = mongoose.model('posts',postSchema) 

module.exports = postModel