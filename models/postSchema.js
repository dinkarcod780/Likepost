const mongoose = require("mongoose")
const postSchema = mongoose.Schema({
    caption:String,
    title:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    likes:[{type:mongoose.Schema.Types.ObjectId,ref: "user"}],
})
module.exports = mongoose.model("post",postSchema);