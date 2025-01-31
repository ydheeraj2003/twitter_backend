import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text : {
        type: String
    },
    video: {
      type: String, // URL to the uploaded video
      required: false,
    },
    img : {
        type: String
    },
    video: {
        type: String,
        required: false, // URL of the uploaded video (if any)
      },
    likes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments : [
        {
            text : {
                type: String,
                required: true
            },
            user : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
},{timestamps: true})

const Post = mongoose.model("Post", postSchema);
export default Post;