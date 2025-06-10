const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        content:{
            type:String,
            required:true,
        },
        postId:{
            type:String,
            required:true,
        },
        userId:{
            type:String,
            required:true,
        },
        // Like:{
        // type:String,
        // required:true,
        // },
        numberOfLikes:{
            type:Number,
            default:0,
        }
    }, { timestamps:true}
)

module.exports=mongoose.model('Comment',commentSchema)